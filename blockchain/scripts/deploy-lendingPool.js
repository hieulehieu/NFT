const { ethers } = require("hardhat");

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
    const LendingPool = await ethers.getContractFactory("LendingPoolV3");
    const WBNB = await ethers.getContractFactory("WBNB");
    const Point = await ethers.getContractFactory("Point");

    //* Deploy contracts */
    console.log("==========================================================================");
    console.log("DEPLOYING CONTRACTS");
    console.log("==========================================================================");

    // const wBNB = await wBNB.deploy();
    // await wBNB.deployed();
    // console.log("wBNB                        deployed to:>>", wBNB.address);

    // const wBNB = await wBNB.attach("0x3b3f35c81488c49b370079fd05cfa917c83a38a9");

    const lendingPool = await LendingPool.deploy(wBNB.address, "0x4F9EF07A6DDF73494D2fF51A8f7B78e9c5815eb2", "10000000000000000000", 0);
    await lendingPool.deployed();
    console.log("LendingPool                     deployed to:>>", lendingPool.address);

    console.log("==========================================================================");
    console.log("VERIFY CONTRACTS");
    console.log("==========================================================================");

    // await hre
    //     .run("verify:verify", {
    //         address: wBNB.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: point.address
    //     })
    //     .catch(console.log);

    // await hre
    //     .run("verify:verify", {
    //         address: lendingPool.address,
    //         constructorArguments: [wBNB.address,
    //         point.address
    //         ]
    //     })
    //     .catch(console.log);

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
