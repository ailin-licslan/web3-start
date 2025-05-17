// import React from "react";
// const { useState, useEffect } = React;
// // @ts-ignore
//
//
//
//
//
//
// import {Web3} from 'web3';
//
// const ZERO20_ABI = [
//     {"constant": true, "inputs": [{"name": "_owner", "type": "address"}], "name": "balanceOf", "outputs": [{"name": "balance", "type": "uint256"}], "type": "function"},
//     {"constant": false, "inputs": [{"name": "_spender", "type": "address"}, {"name": "_value", "type": "uint256"}], "name": "approve", "outputs": [{"name": "", "type": "bool"}], "type": "function"},
//     {"constant": true, "inputs": [{"name": "_owner", "type": "address"}, {"name": "_spender", "type": "address"}], "name": "allowance", "outputs": [{"name": "", "type": "uint256"}], "type": "function"},
//     {"constant": true, "inputs": [], "name": "symbol", "outputs": [{"name": "", "type": "string"}], "type": "function"}
// ];
//
// const BANK_ABI = [
//     {"inputs":[{"internalType":"address","name":"token_","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},
//     {"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOfDeposit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferInBank","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[],"name":"balanceOfAddress","outputs":[{"internalType":"uint256","name":"balance","type":"uint256"}],"stateMutability":"view","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"depositToAddress","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},
//     {"inputs":[],"name":"token","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"}
// ];
//
// const TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// const BANK_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
//
// const CHAINS = {
//     '1': { name: 'Ethereum Mainnet', rpc: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', chainId: '0x1', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, explorer: 'https://etherscan.io' },
//     '137': { name: 'Polygon Mainnet', rpc: 'https://polygon-rpc.com', chainId: '0x89', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, explorer: 'https://polygonscan.com' },
//     '56': { name: 'BNB Chain', rpc: 'https://bsc-dataseed.binance.org', chainId: '0x38', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, explorer: 'https://bscscan.com' },
//     '31337': { name: 'Hardhat 本地', rpc: 'http://127.0.0.1:8545', chainId: '0x7a69', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, explorer: '' }
// };
//
//
// // @ts-ignore
// const AppStarting = () => {
//     const [account, setAccount] = useState(null);
//     const [chainId, setChainId] = useState(null);
//     const [web3, setWeb3] = useState(null);
//     const [error, setError] = useState(null);
//     const [walletBalance, setWalletBalance] = useState(null);
//     const [bankBalance, setBankBalance] = useState(null);
//     const [tokenSymbol, setTokenSymbol] = useState(null);
//     const [amount, setAmount] = useState('');
//     const [toAddress, setToAddress] = useState('');
//     const [allowance, setAllowance] = useState(null);
//
//     useEffect(() => {
//         if (window.ethereum) {
//             const web3Instance = new Web3(window.ethereum);
//             // @ts-ignore
//             setWeb3(web3Instance);
//
//             // @ts-ignore
//             window.ethereum.on('accountsChanged', (accounts) => {
//                 setAccount(accounts[0] || null);
//                 if (accounts[0]) { // @ts-ignore
//                     fetchData(web3Instance, accounts[0]).then(r => {});
//                 }
//             });
//
//             // @ts-ignore
//             window.ethereum.on('chainChanged', (newChainId) => {
//                 setChainId(newChainId);
//                 if (account) { // @ts-ignore
//                     fetchData(web3Instance, account).then(r => {});
//                 }
//             });
//
//             // @ts-ignore
//             web3Instance.eth.getChainId().then(setChainId);
//         } else {
//             // @ts-ignore
//             setError('请安装 MetaMask 钱包');
//         }
//     }, []);
//
//
//     //update data
//     const fetchData = async (web3Instance: null, userAccount: never) => {
//         try {
//
//             // @ts-ignore
//             const tokenContract = new web3Instance.eth.Contract(ZERO20_ABI, TOKEN_ADDRESS);
//             // @ts-ignore
//             const bankContract = new web3Instance.eth.Contract(BANK_ABI, BANK_ADDRESS);
//             //錢包餘額
//             const walletBal = await tokenContract.methods.balanceOf(userAccount).call();
//             //銀行存款
//             const bankBal = await bankContract.methods.balanceOfDeposit(userAccount).call();
//             //ETH
//             const symbol = await tokenContract.methods.symbol().call();
//             //剩餘授權金額
//             const allowanceBal = await tokenContract.methods.allowance(userAccount, BANK_ADDRESS).call();
//             // @ts-ignore
//             setWalletBalance(web3Instance.utils.fromWei(walletBal, 'ether'));
//             // @ts-ignore
//             setBankBalance(web3Instance.utils.fromWei(bankBal, 'ether'));
//             // @ts-ignore
//             setTokenSymbol(symbol==="Z0"?"ETH":"$");
//             // @ts-ignore
//             setAllowance(web3Instance.utils.fromWei(allowanceBal, 'ether'));
//
//             console.log("xxxxxxxxxxxxxxx1walletBal is ================>",walletBal)
//             console.log("xxxxxxxxxxxxxxx2bankBal is ================>",bankBal)
//             console.log("xxxxxxxxxxxxxxx4allowanceBal is ================>",allowanceBal)
//
//         } catch (err) {
//             // @ts-ignore
//             setError('获取数据失败: ' + err.message);
//         }
//     };
//
//     const connectWallet = async () => {
//         if (window.ethereum) {
//             try {
//                 // @ts-ignore
//                 const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//                 setAccount(accounts[0]);
//                 setError(null);
//                 // @ts-ignore
//                 await fetchData(web3, accounts[0]);
//             } catch (err) {
//                 // @ts-ignore
//                 setError('连接钱包失败: ' + err.message);
//             }
//         }
//     };
//
//     const disconnectWallet = () => {
//         setAccount(null);
//         setWalletBalance(null);
//         setBankBalance(null);
//         setTokenSymbol(null);
//         setAllowance(null);
//         // @ts-ignore
//         setError('已断开连接，请在 MetaMask 中确认断开');
//     };
//
//     const switchChain = async (chainId: string) => {
//         try {
//             // @ts-ignore
//             await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
//             setError(null);
//         } catch (err) {
//             // @ts-ignore
//             if (err.code === 4902) {
//                 // @ts-ignore
//                 const chain = CHAINS[parseInt(chainId, 16)];
//                 try {
//                     // @ts-ignore
//                     await window.ethereum.request({
//                         method: 'wallet_addEthereumChain',
//                         params: [{ chainId, chainName: chain.name, rpcUrls: [chain.rpc], nativeCurrency: chain.nativeCurrency, blockExplorerUrls: chain.explorer ? [chain.explorer] : [] }]
//                     });
//                 } catch (addErr) {
//                     // @ts-ignore
//                     setError('添加网络失败: ' + addErr.message);
//                 }
//             } else {
//                 // @ts-ignore
//                 setError('切换网络失败: ' + err.message);
//             }
//         }
//     };
//
//     //授权
//     // @ts-ignore
//     const approve = async () => {
//         debugger
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             // @ts-ignore
//             setError('请输入有效金额');
//             return;
//         }
//         try {
//             //ERC20 合约对象
//             // @ts-ignore
//             const tokenContract = new web3.eth.Contract(ZERO20_ABI, TOKEN_ADDRESS);
//             // @ts-ignore
//             const amountWei = web3.utils.toWei(amount, 'ether');
//             console.log("the Approve amountWei is ", amountWei, "account is ", account)
//             //授权给银行地址可以使用多少金额
//             //const tx = await tokenContract.methods.approve(BANK_ADDRESS, amountWei/(10 ** 18)).send({ from: account });
//             const tx = await tokenContract.methods.approve(BANK_ADDRESS, amountWei).send({ from: account });
//             console.log('Approve Transaction Hash:', tx.transactionHash);
//             await new Promise(resolve => setTimeout(resolve, 1000)); // 等待链上状态同步
//             await fetchData(web3, account);
//             // @ts-ignore
//             setError('授权成功');
//         } catch (err) {
//             console.error('Approve Error:', err);
//             // @ts-ignore
//             setError('授权失败: ' + (err.message || '未知错误'));
//         }
//     };
//
//
//     //存款
//     const deposit = async () => {
//         console.log("the money you want to deposit is :", amount)
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             // @ts-ignore
//             setError('请输入有效金额');
//             return;
//         }
//         try {
//             debugger
//             //ERC20 合约对象
//             // @ts-ignore
//             const tokenContract = new web3.eth.Contract(ZERO20_ABI, TOKEN_ADDRESS);
//
//             //要存多少钱
//             // @ts-ignore
//             const amountWei = web3.utils.toWei(amount, 'ether'); // x eth * 10 ** 18
//
//             //查询向银行合约地址已经授权的金额
//             const currentAllowance = await tokenContract.methods.allowance(account, BANK_ADDRESS).call();
//
//             //ERC20 代币余额
//             // @ts-ignore
//             const walletBal = await tokenContract.methods.balanceOf(account).call();
//
//             //当前账户ETH余额 (合约调用方)
//             // @ts-ignore
//             const ethBalance = await web3.eth.getBalance(account);
//             // @ts-ignore
//             //const ethBalanceWei = web3.utils.toWei(ethBalance);
//             // @ts-ignore  wei====> eth   / (10 ** 18)
//             const allowanceInEther = web3.utils.fromWei(currentAllowance, 'ether');  // x eth /( 10 ** 18)
//             // @ts-ignore  eth====> wei  * (10 ** 18)
//             const currentAllowanceWei = web3.utils.toWei(currentAllowance, 'ether');  // x eth * 10 ** 18
//
//             //console.log('Deposit - Current Allowance (Wei):', currentAllowance, 'Current Allowance (Z0):', allowanceInEther, 'Requested Amount (Wei):', amountWei, 'Requested Amount (Z0):', amountWeiInEther, 'Wallet Balance:', web3.utils.fromWei(walletBal, 'ether'), 'ETH Balance:', web3.utils.fromWei(ethBalance, 'ether'));
//
//             console.log("currentAllowanceWei:",currentAllowanceWei,"amountWei:",amountWei ,"walletBal:", walletBal, "ethBalance:",ethBalance)
//
//             //已经运行被授权可以动用的金额要大于等于存款金额
//             if (BigInt(currentAllowanceWei) < BigInt(amountWei)) {
//                 // @ts-ignore
//                 setError(`授权金额不足，当前: ${allowanceInEther} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             console.log("2222222222222currentAllowance",currentAllowance,"amountWei",amountWei )
//
//             if (BigInt(walletBal) < BigInt(amountWei)) {
//                 // @ts-ignore
//                 setError(`钱包余额不足，当前: ${web3.utils.fromWei(walletBal, 'ether')} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             // @ts-ignore
//             if (BigInt(ethBalance) < BigInt(web3.utils.toWei('0.01', 'ether'))) {
//                 // @ts-ignore
//                 setError(`ETH 余额不足以支付 Gas 费用，当前: ${web3.utils.fromWei(ethBalance, 'ether')} ETH`);
//                 return;
//             }
//             console.log("3333333333333333currentAllowance",currentAllowance,"amountWei",amountWei )
//
//             //BANK合约对象
//             // @ts-ignore
//             const bankContract = new web3.eth.Contract(BANK_ABI, BANK_ADDRESS);
//             console.log("start .....", account)
//
//             //BANK合约调用存款的方法
//             const tx = await bankContract.methods.depositToAddress(amountWei).send({ from: account, gas: 3000000 });
//             //const tx = await bankContract.methods.depositToAddress(amountWei/(10 ** 18)).send({ from: account, gas: 300000 });
//             console.log("end .....")
//             console.log('Deposit Transaction Hash:', tx.transactionHash);
//             await fetchData(web3, account);
//             // @ts-ignore
//             setError('存款成功');
//         } catch (err) {
//             console.error('Deposit Error:', err);
//             // @ts-ignore
//             setError('存款失败: ' + (err.message || '未知错误') + (err.data ? ` - ${JSON.stringify(err.data)}` : ''));
//         }
//     };
//
//     //取款
//     const withdraw = async () => {
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             // @ts-ignore
//             setError('请输入有效金额');
//             return;
//         }
//         try {
//             // @ts-ignore
//             const bankContract = new web3.eth.Contract(BANK_ABI, BANK_ADDRESS);
//             // @ts-ignore
//             const amountWei = web3.utils.toWei(amount, 'ether');
//             const bankBal = await bankContract.methods.balanceOfDeposit(account).call();
//             // @ts-ignore
//             const bankBalWei =  web3.utils.toWei(bankBal, 'ether');
//             // @ts-ignore
//             const ethBalance = await web3.eth.getBalance(account);
//             // @ts-ignore
//             console.log('Withdraw - Bank Balance:', web3.utils.fromWei(bankBal, 'ether'), 'Requested Amount:', amount, 'ETH Balance:', web3.utils.fromWei(ethBalance, 'ether'));
//
//             //银行的存款要大于等于要取的钱
//             if (BigInt(bankBalWei) < BigInt(amountWei)) {
//                 // @ts-ignore
//                 setError(`银行存款不足，当前: ${web3.utils.fromWei(bankBal, 'ether')} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             // @ts-ignore
//             if (BigInt(ethBalance) < BigInt(web3.utils.toWei('0.01', 'ether'))) {
//                 // @ts-ignore
//                 setError(`ETH 余额不足以支付 Gas 费用，当前: ${web3.utils.fromWei(ethBalance, 'ether')} ETH`);
//                 return;
//             }
//             const tx = await bankContract.methods.withdraw(amountWei).send({ from: account, gas: 300000 });
//             console.log('Withdraw Transaction Hash:', tx.transactionHash);
//             await fetchData(web3, account);
//             // @ts-ignore
//             setError('取款成功');
//         } catch (err) {
//             console.error('Withdraw Error:', err);
//             // @ts-ignore
//             setError('取款失败: ' + (err.message || '未知错误') + (err.data ? ` - ${JSON.stringify(err.data)}` : ''));
//         }
//     };
//
//
//     //转账
//     const transferInBank = async () => {
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             // @ts-ignore
//             setError('请输入有效金额');
//             return;
//         }
//         // @ts-ignore
//         if (!web3.utils.isAddress(toAddress)) {
//             // @ts-ignore
//             setError('请输入有效目标地址');
//             return;
//         }
//         try {
//             // @ts-ignore
//             const bankContract = new web3.eth.Contract(BANK_ABI, BANK_ADDRESS);
//             // @ts-ignore
//             const amountWei = web3.utils.toWei(amount, 'ether');
//             const bankBal = await bankContract.methods.balanceOfDeposit(account).call();
//             // @ts-ignore
//             const bankBalWei =  web3.utils.toWei(bankBal, 'ether');
//             console.log("bankBal is ", bankBal, "amountWei is ", amountWei)
//             // @ts-ignore
//             const ethBalance = await web3.eth.getBalance(account);
//             // @ts-ignore
//             console.log('TransferInBank - Bank Balance:', web3.utils.fromWei(bankBal, 'ether'), 'Requested Amount:', amount, 'To Address:', toAddress, 'ETH Balance:', web3.utils.fromWei(ethBalance, 'ether'));
//
//             if (BigInt(bankBalWei) < BigInt(amountWei)) {
//                 // @ts-ignore
//                 setError(`银行存款不足，当前: ${web3.utils.fromWei(bankBal, 'ether')} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             // @ts-ignore
//             if (BigInt(ethBalance) < BigInt(web3.utils.toWei('0.01', 'ether'))) {
//                 // @ts-ignore
//                 setError(`ETH 余额不足以支付 Gas 费用，当前: ${web3.utils.fromWei(ethBalance, 'ether')} ETH`);
//                 return;
//             }
//
//             const tx = await bankContract.methods.transferInBank(toAddress, amountWei).send({ from: account, gas: 300000 });
//             console.log('TransferInBank Transaction Hash:', tx.transactionHash);
//             await fetchData(web3, account);
//             // @ts-ignore
//             setError('银行转账成功');
//         } catch (err) {
//             console.error('TransferInBank Error:', err);
//             // @ts-ignore
//             setError('银行转账失败: ' + (err.message || '未知错误') + (err.data ? ` - ${JSON.stringify(err.data)}` : ''));
//         }
//     };
//
//
//     return (
//         <div id="root" className="min-h-screen bg-gray-100 flex items-center justify-center">
//         <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
//
//             <h3 className="font-bold mb-4 text-center">多链钱包连接</h3>
//
//             {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
//
//             {!account ? (
//                 <button onClick={connectWallet} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">连接钱包</button>
//             ) : (
//                 <div>
//                     <p className="text-sm mb-2"><span className="font-semibold">账户:</span> <span className="break-all">{account}</span></p>
//                     <p className="text-sm mb-2"><span className="font-semibold">当前链:</span> {chainId ? CHAINS[parseInt(chainId, 16)] && CHAINS[parseInt(chainId, 16)].name ? CHAINS[parseInt(chainId, 16)].name : 'HARDHAT' : '未连接'}</p>
//                     {walletBalance && (
//                         <p className="text-sm mb-2"><span className="font-semibold">钱包余额:</span> {walletBalance} {tokenSymbol}</p>
//                     )}
//                     {bankBalance && (
//                         <p className="text-sm mb-2"><span className="font-semibold">银行存款:</span> {bankBalance} {tokenSymbol}</p>
//                     )}
//                     {allowance !== null && (
//                         <p className="text-sm mb-2"><span className="font-semibold">授权金额:</span> {allowance} {tokenSymbol}</p>
//                     )}
//
//                     <div className="mb-4">
//                         <input
//                             type="number"
//                             value={amount}
//                             onChange={(e) => setAmount(e.target.value)}
//                             placeholder="输入金额 (以太)"
//                             className="w-full p-2 mb-2 border rounded"
//                         />
//                         <button onClick={approve} className="w-full bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-600 mb-2">授权</button>
//                         <button onClick={deposit} className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 mb-2">存款</button>
//                         <button onClick={withdraw} className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600 mb-2">取款</button>
//                     </div>
//
//                     <div className="mb-4">
//                         <input
//                             type="text"
//                             value={toAddress}
//                             onChange={(e) => setToAddress(e.target.value)}
//                             placeholder="转账目标地址"
//                             className="w-full p-2 mb-2 border rounded"
//                         />
//                         <button onClick={transferInBank} className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">银行转账</button>
//                     </div>
//
//                     <div className="grid grid-cols-2 gap-2 mb-4">
//                         {Object.keys(CHAINS).map((id) => (
//                             <button
//                                 key={id}
//                                 onClick={() => {
//                                     // @ts-ignore
//                                     return switchChain(CHAINS[id].chainId);
//                                 }}
//                                 className={`py-2 px-4 rounded text-sm ${chainId === CHAINS[id].chainId ? 'bg-green-500 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
//                             >
//                                 切换到 {CHAINS[id].name}
//                             </button>
//                         ))}
//                     </div>
//                     <button onClick={disconnectWallet} className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">断开连接</button>
//                 </div>
//             )}
//         </div>
//         </div>
//     );
// };
//
// export default AppStarting;