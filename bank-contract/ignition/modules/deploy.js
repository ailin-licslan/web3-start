const { ethers } = require("hardhat");

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 部署 Z0Token
    const Z0Token = await ethers.getContractFactory("Zero");
    const z0Token = await Z0Token.deploy("ZERO","Z0")
    await z0Token.waitForDeployment;
    console.log("Z0Token deployed to:", z0Token.address);

    // 部署 v2Bank.sol
    const Bank = await ethers.getContractFactory("v2Bank.sol");
    const bank = await Bank.deploy(z0Token.address);
    await bank.waitForDeployment;
    console.log("v2Bank.sol deployed to:", bank.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

//npx hardhat node  TODO not work yet
//npx hardhat ignition deploy ./ignition/modules/DeployZero.js --network localhost
//npx hardhat ignition deploy ./ignition/modules/DeployBank.js --network localhost
//npx hardhat run ./ignition/modules/deploy.js --network localhost