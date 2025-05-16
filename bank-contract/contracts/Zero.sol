// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

//ERC20 同质化代币生产 
contract Zero is ERC20{
    constructor(string memory name_, string memory symbol_) ERC20(name_, symbol_){
        //生产1000枚代币  Z0
        _mint(msg.sender, 1000*10**18);
    }

}