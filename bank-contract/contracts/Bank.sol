// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {console} from "hardhat/console.sol";

contract Bank{

    // 定义三个事件
    event Deposit(address indexed depositor, uint256 amount, uint256 timestamp);
    event Withdrawal(address indexed withdrawer, uint256 amount, uint256 timestamp);
    event Transfer(address indexed from, address indexed to, uint256 amount, uint256 timestamp);

    error TransferFromFailed(address from, address to, uint256 amount);
    //以太坊中三种交易 普通交易(用户间一个转账)  创建合约 (不少合约生产合约地址) 调用合约(abi 向合约地址发送一笔交易) 
    
    //定义银行账户地址 某个地址有多少存款
    mapping (address=> uint256) public balanceOfDeposit;
    //代币合约地址  immutable:不可修改 对应之前的代币合约地址 v2Zero.sol
    address public immutable token;
    //初始化合约地址  把之前的代币 Z0 合约地址放这里 初始化进去 
    constructor(address token_){
        token = token_;
    }
    //查询当前合约地址余额
    function balanceOfAddress() public view returns(uint256 balance) {
        balance = balanceOfDeposit[msg.sender];
        //return balance[msg.sender];
    }
    //存款 deposit: 将当前调用者账户的余额转到当前合约的地址(相当于存钱到银行)  
    function depositToAddress(uint256 amount) public{
        console.log("deposited amount: ", amount);
        //amount = amount * 10 ** 18;
        bool depositedSuc = IERC20(token).transferFrom(msg.sender, address(this), amount);
        console.log("deposited depositedSuc: ", depositedSuc);
        if (!depositedSuc) {
            console.log("deposited failed: ", msg.sender, "address:", address(this));
            revert TransferFromFailed(msg.sender, address(this), amount);
        }
        balanceOfDeposit[msg.sender] += amount;

        // 触发存款事件
        emit Deposit(msg.sender, amount, block.timestamp);
    }


    //取款  external : 内部外部都可以调用
    function withdraw(uint256 amount) external {
        //amount = amount * 10 ** 18;
        //你取钱不能超过你银行账户中所拥有的钱   这个require可以优化成modifier 
        require(amount<=balanceOfDeposit[msg.sender], "the withdraw amount is too large!");
        //从当前合约地址取款到调用方地址:msg.sender 提多少钱走: amount  内部有回滚机制
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        //如果转账成功 改写银行的余额
        balanceOfDeposit[msg.sender] -= amount;

        // 触发取款事件
        emit Withdrawal(msg.sender, amount, block.timestamp);
    }

    //银行账户之间的转账 将银行中的存钱的地址转账到某个其他的账户 
    function transferInBank(address to, uint256 amount) public {
        //amount = amount * 10 ** 18;
        //转账的金额要小于你银行账户的钱  这个require可以优化成modifier 
        require(amount<=balanceOfDeposit[msg.sender], "the transfer amount is too large!");
        //调用者的银行账户减少多少钱
        balanceOfDeposit[msg.sender]-=amount;
        //转账的目标地址增加多少钱
        balanceOfDeposit[to]+=amount;

        // 触发转账事件
        emit Transfer(msg.sender, to, amount, block.timestamp);
    }

}