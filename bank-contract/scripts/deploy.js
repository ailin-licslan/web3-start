const { ethers } = require("hardhat");

async function main() {
    const [deployer, frontendAccount] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // 部署 Zero 合约
    const Zero = await ethers.getContractFactory("Zero");
    const zero = await Zero.deploy("Zero Token", "Z0");
    await zero.waitForDeployment();
    const zeroAddress = await zero.getAddress();
    console.log("Zero deployed to:", zeroAddress);

    // 部署 Bank 合约
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy(zeroAddress);
    await bank.waitForDeployment();
    const bankAddress = await bank.getAddress();
    console.log("Bank deployed to:", bankAddress);

    // 转移代币给前端账户
    // if (frontendAccount) { // 确保 frontendAccount 存在
    //     await zero.transfer(frontendAccount.address, ethers.parseEther("500")); // 使用 ethers.parseEther
    //     console.log("Transferred 500 Z0 to:", frontendAccount.address);
    //
    //     // 授权 Bank 合约
    //     await zero.connect(frontendAccount).approve(bankAddress, ethers.parseEther("1000"));
    //     console.log("Approved 1000 Z0 to Bank from:", frontendAccount.address);
    // } else {
    //     console.error("Frontend account is undefined. Please ensure multiple signers are available.");
    // }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });


// npx hardhat run scripts/deploy.js --network localhost
// WARNING: You are currently using Node.js v23.11.0, which is not supported by Hardhat. This can lead to unexpected behavior. See https://hardhat.org/nodejs-versions
//
//
// Deploying contracts with the account: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
// Zero deployed to: 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853
// Bank deployed to: 0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6
// Transferred 500 Z0 to: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
// Approved 1000 Z0 to Bank from: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8
