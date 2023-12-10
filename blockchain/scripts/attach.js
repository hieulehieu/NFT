const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
    // const contract = {
    //     characterERC721: "0x3dEA0Cd0c38E354Dc8797299f373F0471ea431e6",
    //     WeaponERC721: "0x22cfDCD1C9aAA37240ae72Db5cfdbEe1F3F0FDf6",
    //     tokenBoundAccountImplement: "0xeEfEdB031ED03Dd88553946b8a74684d538D7d94",
    //     tokenBoundAccountRegistry: "0x0303a0EAfC7f09e6c915EDBb739d2E9507748ce3",
    //     "GOLD-ERC20": "0xa2CF009b28A352B6E40B7feC87BD6c28a9133e52",
    //     "SILVER-ERC20": "0x018faE129a5f6AD10daA9FE1172Dd358148a0E36",
    //     NFT_CONTRACT_ADDRESS: "0x7FBac9d3B38375Be3Cd3ECf9701F4bd3349Dd392",
    //     wBNB_ADDRESS: "0xeFa11f1dc4Ef87Aca3027Cb458b64bf8c0344e1c",
    //     LENDING_POOL_ADDRESS: "0x18D1B265Ad688B09a593CE795B2e51CEF8f41906",
    //     LOAN_ADDRESS: "0xa36b5145Bb49D4ee9EF4f195134B6b9e793C278C",
    //     LiquidateNFTPool: "0x1DB51FEc2c8F28818364D7906A19dc8556d49A4B",
    //     permittedNFTs: "0x43e73Cd24Fa3BeDD8b62D50890CefB921c57887c",
    //     MARKETPLACE: "",
    // };

    // const convertedContracts = Object.keys(contract).reduce((pre, cur) => ({...pre, [cur]: contract[cur].toLowerCase()}), {})
    // console.log(convertedContracts)

    const LendingPool = await ethers.getContractFactory("LendingPoolV3");
    const lendingPool = LendingPool.attach("0x18D1B265Ad688B09a593CE795B2e51CEF8f41906")
    console.log(await lendingPool.userInfo("0x77B6ddbA6AfB1A74979011a07d078Be28f8bF835", {
        blockTag: 34679413
    }))
    
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
