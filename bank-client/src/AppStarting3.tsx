// import React, { useState, useEffect } from "react";
// import Web3 from 'web3';
//
// interface NativeCurrency {
//     name: string;
//     symbol: string;
//     decimals: number;
// }
//
// interface Chain {
//     name: string;
//     rpc: string;
//     chainId: string;
//     nativeCurrency: NativeCurrency;
//     explorer: string;
// }
//
// interface AppState {
//     account: string | null;
//     chainId: string | null;
//     web3: Web3 | null;
//     error: string | null;
//     walletBalance: string | null;
//     bankBalance: string | null;
//     tokenSymbol: string | null;
//     amount: string;
//     toAddress: string;
//     allowance: string | null;
// }
//
// const ZERO20_ABI = [
//     { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" },
//     { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
//     { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "", "type": "uint256" }], "type": "function" },
//     { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function" }
// ];
//
// const BANK_ABI = [
//     { "inputs": [{ "internalType": "address", "name": "token_", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" },
//     { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "balanceOfDeposit", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//     { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transferInBank", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
//     { "inputs": [], "name": "balanceOfAddress", "outputs": [{ "internalType": "uint256", "name": "balance", "type": "uint256" }], "stateMutability": "view", "type": "function" },
//     { "inputs": [{ "name": "amount", "type": "uint256" }], "name": "depositToAddress", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
//     { "inputs": [{ "name": "amount", "type": "uint256" }], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
//     { "inputs": [], "name": "token", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }
// ];
//
// const TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
// const BANK_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
//
// const CHAINS: Record<number, Chain> = {
//     1: { name: 'Ethereum Mainnet', rpc: 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID', chainId: '0x1', nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }, explorer: 'https://etherscan.io' },
//     137: { name: 'Polygon Mainnet', rpc: 'https://polygon-rpc.com', chainId: '0x89', nativeCurrency: { name: 'MATIC', symbol: 'MATIC', decimals: 18 }, explorer: 'https://polygonscan.com' },
//     56: { name: 'BNB Chain', rpc: 'https://bsc-dataseed.binance.org', chainId: '0x38', nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 }, explorer: 'https://bscscan.com' },
//     31337: { name: 'Hardhat 本地', rpc: 'http://127.0.0.1:8545', chainId: '0x7a69', nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }, explorer: '' }
// };
//
// const AppStarting: React.FC = () => {
//     const [account, setAccount] = useState<AppState['account']>(null);
//     const [chainId, setChainId] = useState<AppState['chainId']>(null);
//     const [web3, setWeb3] = useState<Web3 | null>(null);
//     const [error, setError] = useState<AppState['error']>(null);
//     const [walletBalance, setWalletBalance] = useState<AppState['walletBalance']>(null);
//     const [bankBalance, setBankBalance] = useState<AppState['bankBalance']>(null);
//     const [tokenSymbol, setTokenSymbol] = useState<AppState['tokenSymbol']>(null);
//     const [amount, setAmount] = useState<AppState['amount']>('');
//     const [toAddress, setToAddress] = useState<AppState['toAddress']>('');
//     const [allowance, setAllowance] = useState<AppState['allowance']>(null);
//
//     useEffect(() => {
//         if (window.ethereum) {
//             const web3Instance = new Web3(window.ethereum);
//             setWeb3(web3Instance);
//
//             window.ethereum.on('accountsChanged', (accounts: string[]) => {
//                 setAccount(accounts[0] || null);
//                 if (accounts[0]) {
//                     fetchData(web3Instance, accounts[0]);
//                 }
//             });
//
//             window.ethereum.on('chainChanged', (newChainId: string) => {
//                 setChainId(newChainId);
//                 if (account) {
//                     fetchData(web3Instance, account);
//                 }
//             });
//
//             web3Instance.eth.getChainId().then(setChainId);
//         } else {
//             setError('请安装 MetaMask 钱包');
//         }
//     }, [account]);
//
//     const fetchData = async (web3Instance: Web3, userAccount: string) => {
//         try {
//             const tokenContract = new web3Instance.eth.Contract(ZERO20_ABI as any, TOKEN_ADDRESS);
//             const bankContract = new web3Instance.eth.Contract(BANK_ABI as any, BANK_ADDRESS);
//             const walletBal = await tokenContract.methods.balanceOf(userAccount).call();
//             const bankBal = await bankContract.methods.balanceOfDeposit(userAccount).call();
//             const symbol = await tokenContract.methods.symbol().call();
//             const allowanceBal = await tokenContract.methods.allowance(userAccount, BANK_ADDRESS).call();
//             setWalletBalance(web3Instance.utils.fromWei(walletBal, 'ether'));
//             setBankBalance(web3Instance.utils.fromWei(bankBal, 'ether'));
//             setTokenSymbol(symbol === "Z0" ? "ETH" : "$");
//             setAllowance(web3Instance.utils.fromWei(allowanceBal, 'ether'));
//
//             console.log("xxxxxxxxxxxxxxx1walletBal is ================>", walletBal);
//             console.log("xxxxxxxxxxxxxxx2bankBal is ================>", bankBal);
//             console.log("xxxxxxxxxxxxxxx4allowanceBal is ================>", allowanceBal);
//         } catch (err) {
//             setError('获取数据失败: ' + (err as Error).message);
//         }
//     };
//
//     const connectWallet = async () => {
//         if (window.ethereum) {
//             try {
//                 const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
//                 setAccount(accounts[0]);
//                 setError(null);
//                 if (web3 && accounts[0]) {
//                     await fetchData(web3, accounts[0]);
//                 }
//             } catch (err) {
//                 setError('连接钱包失败: ' + (err as Error).message);
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
//         setError('已断开连接，请在 MetaMask 中确认断开');
//     };
//
//     const switchChain = async (chainId: string) => {
//         try {
//             await window.ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId }] });
//             setError(null);
//         } catch (err) {
//             if ((err as any).code === 4902) {
//                 const chain = CHAINS[parseInt(chainId, 16)];
//                 try {
//                     await window.ethereum.request({
//                         method: 'wallet_addEthereumChain',
//                         params: [{ chainId, chainName: chain.name, rpcUrls: [chain.rpc], nativeCurrency: chain.nativeCurrency, blockExplorerUrls: chain.explorer ? [chain.explorer] : [] }]
//                     });
//                 } catch (addErr) {
//                     setError('添加网络失败: ' + (addErr as Error).message);
//                 }
//             } else {
//                 setError('切换网络失败: ' + (err as Error).message);
//             }
//         }
//     };
//
//     const approve = async () => {
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             setError('请输入有效金额');
//             return;
//         }
//         try {
//             const tokenContract = new web3.eth.Contract(ZERO20_ABI as any, TOKEN_ADDRESS);
//             const amountWei = web3.utils.toWei(amount, 'ether');
//             const tx = await tokenContract.methods.approve(BANK_ADDRESS, amountWei).send({ from: account });
//             console.log('Approve Transaction Hash:', tx.transactionHash);
//             await new Promise(resolve => setTimeout(resolve, 1000));
//             await fetchData(web3, account);
//             setError('授权成功');
//         } catch (err) {
//             console.error('Approve Error:', err);
//             setError('授权失败: ' + (err as Error).message || '未知错误');
//         }
//     };
//
//     const deposit = async () => {
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             setError('请输入有效金额');
//             return;
//         }
//         try {
//             const tokenContract = new web3.eth.Contract(ZERO20_ABI as any, TOKEN_ADDRESS);
//             const bankContract = new web3.eth.Contract(BANK_ABI as any, BANK_ADDRESS);
//             const amountWei = web3.utils.toWei(amount, 'ether');
//             const currentAllowance = await tokenContract.methods.allowance(account, BANK_ADDRESS).call();
//             const walletBal = await tokenContract.methods.balanceOf(account).call();
//             const ethBalance = await web3.eth.getBalance(account);
//             const allowanceInEther = web3.utils.fromWei(currentAllowance, 'ether');
//             const currentAllowanceWei = web3.utils.toWei(currentAllowance, 'ether');
//
//             if (BigInt(currentAllowanceWei) < BigInt(amountWei)) {
//                 setError(`授权金额不足，当前: ${allowanceInEther} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             if (BigInt(walletBal) < BigInt(amountWei)) {
//                 setError(`钱包余额不足，当前: ${web3.utils.fromWei(walletBal, 'ether')} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             if (BigInt(ethBalance) < BigInt(web3.utils.toWei('0.01', 'ether'))) {
//                 setError(`ETH 余额不足以支付 Gas 费用，当前: ${web3.utils.fromWei(ethBalance, 'ether')} ETH`);
//                 return;
//             }
//
//             const tx = await bankContract.methods.depositToAddress(amountWei).send({ from: account, gas: 3000000 });
//             console.log('Deposit Transaction Hash:', tx.transactionHash);
//             await fetchData(web3, account);
//             setError('存款成功');
//         } catch (err) {
//             console.error('Deposit Error:', err);
//             setError('存款失败: ' + (err as Error).message + (err as any).data ? ` - ${(err as any).data}` : '');
//         }
//     };
//
//     const withdraw = async () => {
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             setError('请输入有效金额');
//             return;
//         }
//         try {
//             const bankContract = new web3.eth.Contract(BANK_ABI as any, BANK_ADDRESS);
//             const amountWei = web3.utils.toWei(amount, 'ether');
//             const bankBal = await bankContract.methods.balanceOfDeposit(account).call();
//             const ethBalance = await web3.eth.getBalance(account);
//
//             if (BigInt(bankBal) < BigInt(amountWei)) {
//                 setError(`银行存款不足，当前: ${web3.utils.fromWei(bankBal, 'ether')} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             if (BigInt(ethBalance) < BigInt(web3.utils.toWei('0.01', 'ether'))) {
//                 setError(`ETH 余额不足以支付 Gas 费用，当前: ${web3.utils.fromWei(ethBalance, 'ether')} ETH`);
//                 return;
//             }
//
//             const tx = await bankContract.methods.withdraw(amountWei).send({ from: account, gas: 300000 });
//             console.log('Withdraw Transaction Hash:', tx.transactionHash);
//             await fetchData(web3, account);
//             setError('取款成功');
//         } catch (err) {
//             console.error('Withdraw Error:', err);
//             setError('取款失败: ' + (err as Error).message + (err as any).data ? ` - ${(err as any).data}` : '');
//         }
//     };
//
//     const transferInBank = async () => {
//         if (!web3 || !account) return;
//         if (!amount || parseFloat(amount) <= 0) {
//             setError('请输入有效金额');
//             return;
//         }
//         if (!web3.utils.isAddress(toAddress)) {
//             setError('请输入有效目标地址');
//             return;
//         }
//         try {
//             const bankContract = new web3.eth.Contract(BANK_ABI as any, BANK_ADDRESS);
//             const amountWei = web3.utils.toWei(amount, 'ether');
//             const bankBal = await bankContract.methods.balanceOfDeposit(account).call();
//             const ethBalance = await web3.eth.getBalance(account);
//
//             if (BigInt(bankBal) < BigInt(amountWei)) {
//                 setError(`银行存款不足，当前: ${web3.utils.fromWei(bankBal, 'ether')} ${tokenSymbol}, 所需: ${amount} ${tokenSymbol}`);
//                 return;
//             }
//             if (BigInt(ethBalance) < BigInt(web3.utils.toWei('0.01', 'ether'))) {
//                 setError(`ETH 余额不足以支付 Gas 费用，当前: ${web3.utils.fromWei(ethBalance, 'ether')} ETH`);
//                 return;
//             }
//
//             const tx = await bankContract.methods.transferInBank(toAddress, amountWei).send({ from: account, gas: 300000 });
//             console.log('TransferInBank Transaction Hash:', tx.transactionHash);
//             await fetchData(web3, account);
//             setError('银行转账成功');
//         } catch (err) {
//             console.error('TransferInBank Error:', err);
//             setError('银行转账失败: ' + (err as Error).message + (err as any).data ? ` - ${(err as any).data}` : '');
//         }
//     };
//
//     return (
//         <div id="root" className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4">
//             <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full border border-gray-200">
//                 <h3 className="font-bold mb-4 text-center text-lg text-gray-800">多链钱包连接</h3>
//                 {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
//                 {!account ? (
//                     <button onClick={connectWallet} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">连接钱包</button>
//                 ) : (
//                     <div>
//                         <p className="text-sm mb-2 text-gray-700"><span className="font-semibold">账户:</span> <span className="break-all">{account}</span></p>
//                         <p className="text-sm mb-2 text-gray-700"><span className="font-semibold">当前链:</span> {chainId ? CHAINS[parseInt(chainId, 16)]?.name || 'HARDHAT' : '未连接'}</p>
//                         {walletBalance && (
//                             <p className="text-sm mb-2 text-gray-700"><span className="font-semibold">钱包余额:</span> {walletBalance} {tokenSymbol}</p>
//                         )}
//                         {bankBalance && (
//                             <p className="text-sm mb-2 text-gray-700"><span className="font-semibold">银行存款:</span> {bankBalance} {tokenSymbol}</p>
//                         )}
//                         {allowance !== null && (
//                             <p className="text-sm mb-2 text-gray-700"><span className="font-semibold">授权金额:</span> {allowance} {tokenSymbol}</p>
//                         )}
//                         <div className="mb-4 space-y-3">
//                             <div className="flex items-center space-x-2">
//                                 <button onClick={approve} className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition duration-200">授权</button>
//                                 <input
//                                     type="number"
//                                     value={amount}
//                                     onChange={(e) => setAmount(e.target.value)}
//                                     placeholder="金额 (以太)"
//                                     className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                                 />
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <button onClick={deposit} className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200">存款</button>
//                                 <input
//                                     type="number"
//                                     value={amount}
//                                     onChange={(e) => setAmount(e.target.value)}
//                                     placeholder="金额 (以太)"
//                                     className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
//                                 />
//                             </div>
//                             <div className="flex items-center space-x-2">
//                                 <button onClick={withdraw} className="flex-1 bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition duration-200">取款</button>
//                                 <input
//                                     type="number"
//                                     value={amount}
//                                     onChange={(e) => setAmount(e.target.value)}
//                                     placeholder="金额 (以太)"
//                                     className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//                                 />
//                             </div>
//                         </div>
//                         <div className="mb-4">
//                             <input
//                                 type="text"
//                                 value={toAddress}
//                                 onChange={(e) => setToAddress(e.target.value)}
//                                 placeholder="转账目标地址"
//                                 className="w-full p-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                             />
//                             <button onClick={transferInBank} className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200">银行转账</button>
//                         </div>
//                         <div className="mb-4">
//                             <select
//                                 onChange={(e) => switchChain(CHAINS[parseInt(e.target.value)].chainId)}
//                                 className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-700"
//                             >
//                                 <option value="" disabled selected>选择链</option>
//                                 {Object.keys(CHAINS).map((id) => (
//                                     <option key={id} value={id}>
//                                         {CHAINS[parseInt(id)].name}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <button onClick={disconnectWallet} className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition duration-200 text-sm">断开连接</button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };
//
// export default AppStarting;