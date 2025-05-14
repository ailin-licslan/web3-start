// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

// Bank contract for depositing, withdrawing, and transferring tokens
contract Bank {
    // Mapping to store user deposits (address => token balance)
    mapping(address => uint256) public balanceOfDeposit;

    // Immutable token contract address (Zero token)
    address public immutable token;

    // Constructor to set the token contract address
    constructor(address token_) {
        token = token_;
    }

    // Modifier to check if the amount is valid for withdrawal or transfer
    modifier sufficientBalance(uint256 amount) {
        require(amount <= balanceOfDeposit[msg.sender], "Insufficient balance");
        _;
    }

    // Query the balance of the caller in the bank (returns in token units)
    function balanceOfAddress() public view returns (uint256) {
        return balanceOfDeposit[msg.sender] / (10**18);
    }

    // Deposit tokens to the bank contract
    function depositToAddress(uint256 amount) public {
        amount = amount * 10**18; // Convert to token units
        // Transfer tokens from caller to this contract (requires prior approval)
        require(
            IERC20(token).transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        // Update caller's deposit balance
        balanceOfDeposit[msg.sender] += amount;
    }

    // Withdraw tokens from the bank
    function withdraw(uint256 amount) external sufficientBalance(amount * 10**18) {
        amount = amount * 10**18; // Convert to token units
        // Safely transfer tokens to the caller
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        // Update caller's deposit balance
        balanceOfDeposit[msg.sender] -= amount;
    }

    // Transfer tokens between bank accounts
    function transferInBank(address to, uint256 amount) public sufficientBalance(amount * 10**18) {
        amount = amount * 10**18; // Convert to token units
        // Update balances: deduct from sender, add to recipient
        balanceOfDeposit[msg.sender] -= amount;
        balanceOfDeposit[to] += amount;
    }

    // Approve token allowance for the bank contract
    function approveBank(uint256 amount) public {
        amount = amount * 10**18; // Convert to token units
        // Approve the bank contract to spend tokens on behalf of the caller
        require(
            IERC20(token).approve(address(this), amount),
            "Approval failed"
        );
    }
}