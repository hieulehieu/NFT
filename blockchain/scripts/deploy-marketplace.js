const { ethers } = require("hardhat");

async function main() {
    //* Get network */
    const accounts = await ethers.getSigners();

    //* Loading contract factory */
    const Marketplace = await ethers.getContractFactory("Marketplace");

    // //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");
    const treasury = "0xcCbaead41F6adfA1F0C773dB8A4ae7D088d55c80";
    const marketPercent = 250;
    const marketplace = await Marketplace.deploy(treasury, marketPercent);
    console.log("Marketplace                        deployed to:>>", marketplace.address.toLowerCase());
    await marketplace.deployed();

    console.log("==========================================================================");
    console.log("VERIFY");
    console.log("==========================================================================");

    run("verify:verify", {
        address: marketplace.address,
        constructorArguments: [treasury, marketPercent],
    });

    console.log("==========================================================================");
    console.log("VERIFY SUCCESS");
    console.log("==========================================================================");

    const DirectLoanFixedOffer = await ethers.getContractFactory("DirectLoanFixedOffer", {
        libraries: {
            LoanChecksAndCalculations: "0x0ea76264780491b96403DB8B771C881f78D8dcC2",
            NFTfiSigningUtils: "0xE30074f0c6820bDbC449A8a5546d746d377d5636",
        },
    });
    const loan = DirectLoanFixedOffer.attach("0x95fcdc7076ca3711241352085f8794e79aa9f2ad");
    const tx = await loan.setMarketplace(marketplace.address);
    console.log(tx);

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
