// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// ERC20 token contract for Zero (Z0) token
contract Zero is ERC20 {
    // Constructor to initialize token with name, symbol, and initial supply
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_) {
        // Mint 1000 tokens with 18 decimals to the deployer
        _mint(msg.sender, 1000 * 10**18);
    }
}