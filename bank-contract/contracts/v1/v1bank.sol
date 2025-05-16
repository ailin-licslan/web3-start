// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract v1Bank{
    
    //以太坊中三种交易 普通交易(用户间一个转账)  创建合约 (不少合约生产合约地址) 调用合约(abi 向合约地址发送一笔交易) 
    
    //定义银行账户地址 某个地址有多少存款
    mapping (address=> uint256) public balanceOfDeposit;
    //代币合约地址  immutable:不可修改 对应之前的代币合约地址 v2Zero.sol.sol
    address public immutable token;
    //初始化合约地址  把之前的代币 Z0 合约地址放这里 初始化进去 
    constructor(address token_){
        token = token_;
    }
    //查询当前合约地址余额
    function balanceOfAddress() public view returns(uint256 balance) {
        balance = balanceOfDeposit[msg.sender]/ (10**18);
        //return balance[msg.sender];
    }
    //存款 deposit: 将当前调用者账户的余额转到当前合约的地址(相当于存钱到银行)  
    function depositToAddress(uint256 amount) public{   
        amount = amount * 10 ** 18;
        //从当前调用者: FROM==>msg.sender 转多少==> amount 到 TO:什么地址==>address(this) 
        //IERC20(token).transferFrom(msg.sender,address(this),amount);  返回结果时bool 所以可以判断一下 true才是转账成功 否则就会中断后续操作和回滚
        //transferFrom 再转账时需要提前授权 approve一下给到当前的银行合约让其可以操作之前代币的里面的账户金额 
        // USER X ===> X授权银行合约可以转多少  X 调用ERC20的approve方法 approve(银行合约地址 address, 可以转多少amount)
        // USER X ===> X调用合约bank 就是当前合约的depositToAddress方法 depositToAddress(可以转多少amount) 完成存钱操作
        //uniswap 授权优化  EIP2612 线下签名授权 可以节省一笔gas费
        require(IERC20(token).transferFrom(msg.sender, address(this), amount),"The transfer not success!");
        //将当前账户的余额+=转多少 和存钱到当前合约的地址 balanceOfDeposit[msg.sender] += amount  ==>balanceOfDeposit[address(this)] = balanceOfDeposit[address(this)] + amount
        //require()函数会判断前一个表达式的结果是否为真，如果为假则停止后续操作并回滚状态。此函数的返回结果是bool类型，如果为true则表示转账成功，否则则表示转账失败
        balanceOfDeposit[msg.sender] += amount;    //将当前调用者的余额存到map中
    }


    //取款  external : 内部外部都可以调用
    function withdraw(uint256 amount) external {
        amount = amount * 10 ** 18;
        //你取钱不能超过你银行账户中所拥有的钱   这个require可以优化成modifier 
        require(amount<=balanceOfDeposit[msg.sender], "the withdraw amount is too large!");
        //从当前合约地址取款到调用方地址:msg.sender 提多少钱走: amount  内部有回滚机制
        SafeERC20.safeTransfer(IERC20(token), msg.sender, amount);
        //如果转账成功 改写银行的余额
        balanceOfDeposit[msg.sender] -= amount;
    }

    //银行账户之间的转账 将银行中的存钱的地址转账到某个其他的账户 
    function transferInBank(address to, uint256 amount) public {
        amount = amount * 10 ** 18;
        //转账的金额要小于你银行账户的钱  这个require可以优化成modifier 
        require(amount<=balanceOfDeposit[msg.sender], "the transfer amount is too large!");
        //调用者的银行账户减少多少钱
        balanceOfDeposit[msg.sender]-=amount;
        //转账的目标地址增加多少钱
        balanceOfDeposit[to]+=amount;
    }
}