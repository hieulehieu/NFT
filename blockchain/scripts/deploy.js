const { ethers } = require("hardhat");
const fs = require("fs");
require("dotenv").config();
const env = process.env;

const BASE_URI = "https://chonksociety.s3.us-east-2.amazonaws.com/metadata/";

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    console.log("==========================================================================");
    console.log("ACCOUNTS:");
    console.log("==========================================================================");
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        console.log(` Account ${i}: ${account.address}`);
    }

    //* Loading contract factory */
    const PermittedNFTs = await ethers.getContractFactory("PermittedNFTs");
    const LoanChecksAndCalculations = await hre.ethers.getContractFactory("LoanChecksAndCalculations");
    const NFTfiSigningUtils = await hre.ethers.getContractFactory("NFTfiSigningUtils");
    const LendingPool = await ethers.getContractFactory("LendingPoolV3");
    const WBNB = await ethers.getContractFactory("WBNB");
    const Chonk = await ethers.getContractFactory("ChonkSociety");
    const LiquidateNFTPool = await ethers.getContractFactory("LiquidateNFTPool");
    const Marketplace = await ethers.getContractFactory("Marketplace");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    const treasury = "0xAc84926f0b9df7ff3B4f4377C5536Fff89e9aF54";
    const marketPercent = 100;

    let loanChecksAndCalculations = await LoanChecksAndCalculations.deploy();
    console.log("Library LoanChecksAndCalculations deployed to:", loanChecksAndCalculations.address);
    await loanChecksAndCalculations.deployed();

    let nftfiSigningUtils = await NFTfiSigningUtils.deploy();
    console.log("Library NFTfiSigningUtils deployed to:", nftfiSigningUtils.address);
    await nftfiSigningUtils.deployed();

    const permittedNFTs = await PermittedNFTs.deploy(accounts[0].address);
    console.log("PermittedNFTs                        deployed to:>>", permittedNFTs.address);
    await permittedNFTs.deployed();

    const liquidateNFTPool = await LiquidateNFTPool.deploy(accounts[0].address);
    console.log("LiquidateNFTPool                        deployed to:>>", liquidateNFTPool.address);
    await liquidateNFTPool.deployed();

    const wBNB = await WBNB.deploy();
    console.log("wBNB                        deployed to:>>", wBNB.address);
    await wBNB.deployed();

    const chonk = await Chonk.deploy(BASE_URI);
    console.log("chonk                        deployed to:>>", chonk.address);
    await chonk.deployed();

    // const loanChecksAndCalculations = LoanChecksAndCalculations.attach("0x0ea76264780491b96403DB8B771C881f78D8dcC2");
    // const nftfiSigningUtils = NFTfiSigningUtils.attach("0xE30074f0c6820bDbC449A8a5546d746d377d5636");
    // const permittedNFTs = await PermittedNFTs.attach("0x43e73Cd24Fa3BeDD8b62D50890CefB921c57887c");
    // const liquidateNFTPool = await LiquidateNFTPool.attach("0x1DB51FEc2c8F28818364D7906A19dc8556d49A4B");
    // const wBNB = WBNB.attach("0xefa11f1dc4ef87aca3027cb458b64bf8c0344e1c");
    // const chonk = Chonk.attach("0x7FBac9d3B38375Be3Cd3ECf9701F4bd3349Dd392");
    // const lendingPool = LendingPool.attach("0x18d1b265ad688b09a593ce795b2e51cef8f41906");

    const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
            LoanChecksAndCalculations: loanChecksAndCalculations.address,
            NFTfiSigningUtils: nftfiSigningUtils.address,
        },
    });

    const lendingPool = await LendingPool.deploy(wBNB.address, treasury, "10000000000000000000", 0);
    console.log("LendingPool                     deployed to:>>", lendingPool.address);
    await lendingPool.deployed();

    const marketplace = await Marketplace.deploy(treasury, marketPercent);
    console.log("Marketplace                        deployed to:>>", marketplace.address);
    await marketplace.deployed();

    const directLoanFixedOffer = await DirectLoanFixedOffer.deploy(accounts[0].address, lendingPool.address, marketplace.address, permittedNFTs.address, [wBNB.address]);
    console.log("DirectLoanFixedOffer                        deployed to:>>", directLoanFixedOffer.address);
    await directLoanFixedOffer.deployed();

    console.log("========= LENDING POOL TRANSACTION ===========");
    await lendingPool.approve(directLoanFixedOffer.address, ethers.constants.MaxUint256);

    console.log("========= permittedNFTs TRANSACTION ===========");
    await permittedNFTs.setNFTPermit(chonk.address, true);

    console.log("==========================================================================");
    console.log("DONE");
    console.log("==========================================================================");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
