const { ethers } = require("hardhat");
require("dotenv").config();

const CHARACTER_URI = "https://res.cloudinary.com/htphong02/raw/upload/v1689755573/metadata/1.json";
const WEAPON_URI = "https://res.cloudinary.com/htphong02/raw/upload/v1689756298/metadata/weapons";

async function main() {
    // //* Get network */
    const accounts = await ethers.getSigners();

    console.log("==========================================================================");
    console.log("ACCOUNTS:");
    console.log("==========================================================================");
    for (let i = 0; i < accounts.length; i++) {
        const account = accounts[i];
        console.log(` Account ${i}: ${account.address}`);
    }

    const CharacterERC721 = await ethers.getContractFactory("Character");
    const Weapon = await ethers.getContractFactory("Weapon");
    const GOLD = await ethers.getContractFactory("GOLD");
    const SILVER = await ethers.getContractFactory("SILVER");
    const TokenBoundAccount = await ethers.getContractFactory("TokenBoundAccount");
    const TokenBoundAccountRegistry = await ethers.getContractFactory("TokenBoundAccountRegistry");

    const characterERC721 = await CharacterERC721.deploy();
    console.log("characterERC721", characterERC721.address);
    await characterERC721.deployed();

    const weapon = await Weapon.deploy();
    console.log("weapon", weapon.address);
    await weapon.deployed();

    const gold = await GOLD.deploy();
    console.log("gold", gold.address);
    await gold.deployed();

    const silver = await SILVER.deploy();
    console.log("silver", silver.address);
    await silver.deployed();
    
    const tokenBoundAccount = await TokenBoundAccount.deploy();
    console.log("tokenBoundAccount", tokenBoundAccount.address);
    await tokenBoundAccount.deployed();

    const tokenBoundAccountRegistry = await TokenBoundAccountRegistry.deploy();
    console.log("tokenBoundAccountRegistry", tokenBoundAccountRegistry.address);
    await tokenBoundAccountRegistry.deployed();
    
    // const characterERC721 = CharacterERC721.attach("0x3dEA0Cd0c38E354Dc8797299f373F0471ea431e6");
    // const weapon = Weapon.attach("0x22cfDCD1C9aAA37240ae72Db5cfdbEe1F3F0FDf6");
    // const gold = GOLD.attach("0xa2CF009b28A352B6E40B7feC87BD6c28a9133e52");
    // const silver = SILVER.attach("0x018faE129a5f6AD10daA9FE1172Dd358148a0E36");
    // const tokenBoundAccount = TokenBoundAccount.attach("0xeEfEdB031ED03Dd88553946b8a74684d538D7d94");
    // const tokenBoundAccountRegistry = TokenBoundAccountRegistry.attach("0x0303a0EAfC7f09e6c915EDBb739d2E9507748ce3");

    console.log("==========================================================================");
    console.log("EARLY TRANSACTION");
    console.log("==========================================================================");

    console.log("MINT CHARACTER NFT");
    let tx = await characterERC721.mint(accounts[0].address, CHARACTER_URI);
    await tx.wait();

    console.log("CREATE TOKEN BOUND ACCOUNT");
    tx = await tokenBoundAccountRegistry.createAccount(tokenBoundAccount.address, 97, characterERC721.address, 1, 200);
    const receipt = await tx.wait();
    const args = receipt.events.find((ev) => ev.event === "AccountCreated").args;
    const account = args[0];
    console.log("token bound account", account);

    console.log("MINT WEAPON");
    for (let i = 3; i < 5; i++) {
        let tx = await weapon.mint(accounts[0].address, `${WEAPON_URI}/${i}.json`);
        await tx.wait();
        console.log("SEND WEAPON", i);
        tx = await weapon.connect(accounts[0]).transferFrom(accounts[0].address, "0x9dd9B2c807A2452e5020a5F211660e0fC73ee6ef", i);
        await tx.wait();
    }

    console.log("MINT GOLD AND SILVER");
    tx = await gold.mint("0x9dd9B2c807A2452e5020a5F211660e0fC73ee6ef", ethers.utils.parseUnits("50", 18));
    await tx.wait();
    await silver.mint("0x9dd9B2c807A2452e5020a5F211660e0fC73ee6ef", ethers.utils.parseUnits("43", 18));

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
