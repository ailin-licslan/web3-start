const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Bank", function () {
    let zero, bank, owner, user1, user2;

    beforeEach(async function () {
        [owner, user1, user2] = await ethers.getSigners();

        // Deploy Zero token contract
        const Zero = await ethers.getContractFactory("Zero");
        zero = await Zero.deploy("Zero Token", "Z0");
        await zero.waitForDeployment();
        console.log("Zero contract deployed at:", zero.target);

        // Deploy Bank contract with Zero token address
        const Bank = await ethers.getContractFactory("Bank");
        bank = await Bank.deploy(zero.target);
        await bank.waitForDeployment();
        console.log("Bank contract deployed at:", bank.target);

        // Mint 100 Z0 tokens to user1
        await zero.transfer(user1.address, ethers.parseEther("100"));
    });

    it("should allow deposits", async function () {
        // Approve Bank to spend 50 Z0 tokens on behalf of user1
        await zero.connect(user1).approve(bank.target, ethers.parseEther("50"));

        // Deposit 50 Z0 tokens (contract multiplies by 10^18 internally)
        await bank.connect(user1).depositToAddress(ethers.parseUnits("50", 0));

        // Check balance (balanceOfAddress divides by 10^18)
        const balance = await bank.connect(user1).balanceOfAddress();
        expect(balance).to.equal(50); // 50 Z0 tokens
    });

    it("should allow withdrawals", async function () {
        // Approve Bank to spend 50 Z0 tokens
        await zero.connect(user1).approve(bank.target, ethers.parseEther("50"));

        // Deposit 50 Z0 tokens
        await bank.connect(user1).depositToAddress(ethers.parseUnits("50", 0));

        // Withdraw 30 Z0 tokens
        await bank.connect(user1).withdraw(ethers.parseUnits("30", 0));

        // Check balance (should be 20 Z0 tokens)
        const balance = await bank.connect(user1).balanceOfAddress();
        expect(balance).to.equal(20); // 50 - 30 = 20 Z0 tokens
    });

    it("should allow transfers", async function () {
        // Approve Bank to spend 50 Z0 tokens
        await zero.connect(user1).approve(bank.target, ethers.parseEther("50"));

        // Deposit 50 Z0 tokens
        await bank.connect(user1).depositToAddress(ethers.parseUnits("50", 0));

        // Transfer 20 Z0 tokens to user2
        await bank.connect(user1).transferInBank(user2.address, ethers.parseUnits("20", 0));

        // Check user1's balance (should be 30 Z0 tokens)
        const user1Balance = await bank.connect(user1).balanceOfAddress();
        expect(user1Balance).to.equal(30); // 50 - 20 = 30 Z0 tokens

        // Check user2's balance (should be 20 Z0 tokens)
        const user2Balance = await bank.connect(user2).balanceOfAddress();
        expect(user2Balance).to.equal(20); // 20 Z0 tokens
    });

    it("should fail if withdraw amount exceeds balance", async function () {
        // Deposit 50 Z0 tokens to have some balance
        await zero.connect(user1).approve(bank.target, ethers.parseEther("50"));
        await bank.connect(user1).depositToAddress(ethers.parseUnits("50", 0));

        // Attempt to withdraw 101 Z0 tokens (more than deposited)
        await expect(
            bank.connect(user1).withdraw(ethers.parseUnits("101", 0))
        ).to.be.revertedWith("Insufficient balance");
    });
});