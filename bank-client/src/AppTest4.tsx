import React, { useState } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig, useWeb3Modal } from '@web3modal/ethers/react';
import { abi as ERC20_ABI } from './abis/ERC20.json';
import { abi as Bank_ABI } from './abis/Bank.json';
const TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3'; // 替换为你的 Z0 token 合约地址
const BANK_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512'; // 替换为你的 bank 合约地址
const CHAINS = [
    {
        chainId: '0x7A69', // Hardhat 本地链 (31337)
        name: 'Hardhat Local',
        rpcUrl: 'http://127.0.0.1:8545',
    },
    {
        chainId: '0x1', // Ethereum 主网
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    },
    {
        chainId: '0x5', // Goerli 测试网
        name: 'Goerli Testnet',
        rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
    },
];

// Web3Modal 配置
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'; // 替换为你的 WalletConnect project ID
const metadata = {
    name: 'Z0 v2Bank.sol DApp',
    description: '一个去中心化的 Z0 token 银行',
    url: 'http://localhost:5173', // 与实际运行的 URL 匹配
    icons: ['https://your-dapp-url.com/icon.png'],
};

const chainsConfig = CHAINS.map(chain => ({
    chainId: parseInt(chain.chainId, 16),
    name: chain.name,
    currency: 'ETH',
    rpcUrl: chain.rpcUrl,
    explorerUrl: chain.chainId === '0x1' ? 'https://etherscan.io' : 'https://goerli.etherscan.io',
}));

const ethersConfig = defaultConfig({
    metadata,
    defaultChainId: parseInt(CHAINS[0].chainId, 16),
    enableEIP6963: true,
});

createWeb3Modal({
    ethersConfig,
    chains: chainsConfig,
    projectId,
    themeMode: 'dark',
});

const AppTest4: React.FC = () => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    // @ts-ignore
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string>('');
    const [chainId, setChainId] = useState<string>('');
    const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
    const [bankContract, setBankContract] = useState<ethers.Contract | null>(null);
    const [approveAmount, setApproveAmount] = useState<string>(''); // 授权金额
    const [depositAmount, setDepositAmount] = useState<string>(''); // 存款金额
    const [withdrawAmount, setWithdrawAmount] = useState<string>(''); // 取款金额
    const [transferAmount, setTransferAmount] = useState<string>(''); // 转账金额
    const [recipient, setRecipient] = useState<string>(''); // 收款地址
    const [error, setError] = useState<string>('');

    const { open } = useWeb3Modal();


    // 初始化钱包连接
    const connectWallet = async () => {
        try {
            // 打开 Web3Modal 模态框
            await open();
            debugger
            // Web3Modal 会自动处理连接，我们需要在连接后手动获取提供者
            if (window.ethereum) {
                const modalProvider = window.ethereum;
                // @ts-ignore
                const web3Provider = new ethers.BrowserProvider(modalProvider);
                const signer = await web3Provider.getSigner();
                const address = await signer.getAddress();
                const network = await web3Provider.getNetwork();

                // 确保 chainId 是有效的
                if (!network.chainId) {
                    throw new Error('无法获取链 ID');
                }

                // 直接使用 chainId（bigint）并转换为十六进制字符串
                // @ts-ignore
                console.log(network.chainId.toString())
                //const chainIdHex = ethers.hexlify(network.chainId);

                setProvider(web3Provider);
                setSigner(signer);
                setAccount(address);
                //setChainId(chainIdHex);

                // 初始化合约
                const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);
                const bank = new ethers.Contract(BANK_ADDRESS, Bank_ABI, signer);
                setTokenContract(token);
                setBankContract(bank);

                // 处理账户和链的变化
                // @ts-ignore
                modalProvider.on('accountsChanged', (accounts: string[]) => {
                    setAccount(accounts[0] || '');
                    if (!accounts.length) {
                        resetState();
                    }
                });
                // @ts-ignore
                modalProvider.on('chainChanged', (newChainId: string) => {
                    setChainId(newChainId);
                    window.location.reload();
                });
            } else {
                throw new Error('未检测到以太坊提供者');
            }
        } catch (err: any) {
            setError(err.message || '无法连接钱包');
            console.error('连接钱包失败:', err);
        }
    };

    // 重置状态
    const resetState = () => {
        setProvider(null);
        setSigner(null);
        setAccount('');
        setChainId('');
        setTokenContract(null);
        setBankContract(null);
    };

    // 切换链
    const switchChain = async (targetChainId: string) => {
        try {
            await provider?.send('wallet_switchEthereumChain', [{ chainId: targetChainId }]);
        } catch (err: any) {
            if (err.code === 4902) {
                const chain = CHAINS.find(c => c.chainId === targetChainId);
                if (chain) {
                    await provider?.send('wallet_addEthereumChain', [{
                        chainId: targetChainId,
                        chainName: chain.name,
                        rpcUrls: [chain.rpcUrl],
                    }]);
                }
            } else {
                setError('无法切换链: ' + err.message);
                console.error(err);
            }
        }
    };


    // 授权银行使用 token
    const approveBank = async () => {
        try {
            if (!approveAmount) throw new Error('请输入授权金额');
            const tx = await tokenContract?.approveBank(BANK_ADDRESS, ethers.parseEther(approveAmount));
            await tx.wait();
            alert('授权成功');
        } catch (err: any) {
            setError('授权失败: ' + err.message);
            console.error(err);
        }
    };

    // 存款到银行
    const depositTokens = async () => {
        try {
            if (!depositAmount) throw new Error('请输入存款金额');
            const tx = await bankContract?.depositToAddress(ethers.parseEther(depositAmount));
            await tx.wait();
            alert('存款成功');
            setDepositAmount('');
        } catch (err: any) {
            setError('存款失败: ' + err.message);
            console.error(err);
        }
    };

    // 从银行取款
    const withdrawTokens = async () => {
        try {
            if (!withdrawAmount) throw new Error('请输入取款金额');
            const tx = await bankContract?.withdraw(ethers.parseEther(withdrawAmount));
            await tx.wait();
            alert('取款成功');
            setWithdrawAmount('');
        } catch (err: any) {
            setError('取款失败: ' + err.message);
            console.error(err);
        }
    };

    // 在银行内转账
    const transferTokens = async () => {
        try {
            if (!transferAmount || !recipient) throw new Error('请输入转账金额和收款地址');
            const tx = await bankContract?.transferInBank(recipient, ethers.parseEther(transferAmount));
            await tx.wait();
            alert('转账成功');
            setTransferAmount('');
            setRecipient('');
        } catch (err: any) {
            setError('转账失败: ' + err.message);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex flex-col items-center p-6">
            <h1 className="text-4xl font-extrabold text-white mb-8 drop-shadow-lg">Z0 Bank DApp</h1>

            {/* 钱包连接 */}
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                    连接钱包
                </button>
            ) : (
                <div className="w-full max-w-md space-y-6">
                    {/* 账户信息 */}
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <p className="text-gray-200 text-center">
                            已连接: {account.slice(0, 6)}...{account.slice(-4)}
                        </p>
                        <select
                            value={chainId}
                            onChange={(e) => switchChain(e.target.value)}
                            className="mt-2 w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                        >
                            {CHAINS.map(chain => (
                                <option key={chain.chainId} value={chain.chainId}>
                                    {chain.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 授权银行 */}
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-200 mb-3">授权银行</h2>
                        <input
                            type="text"
                            value={approveAmount}
                            onChange={(e) => setApproveAmount(e.target.value)}
                            placeholder="授权金额 (Z0)"
                            className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-3"
                        />
                        <button
                            onClick={approveBank}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            授权银行
                        </button>
                    </div>

                    {/* 存款 */}
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-200 mb-3">存款</h2>
                        <input
                            type="text"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(e.target.value)}
                            placeholder="存款金额 (Z0)"
                            className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-3"
                        />
                        <button
                            onClick={depositTokens}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            存款
                        </button>
                    </div>

                    {/* 取款 */}
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-200 mb-3">取款</h2>
                        <input
                            type="text"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="取款金额 (Z0)"
                            className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-3"
                        />
                        <button
                            onClick={withdrawTokens}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            取款
                        </button>
                    </div>

                    {/* 转账 */}
                    <div className="bg-gray-700 bg-opacity-50 p-4 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-gray-200 mb-3">转账</h2>
                        <input
                            type="text"
                            value={transferAmount}
                            onChange={(e) => setTransferAmount(e.target.value)}
                            placeholder="转账金额 (Z0)"
                            className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-3"
                        />
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="收款地址"
                            className="w-full bg-gray-800 text-gray-200 p-2 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all mb-3"
                        />
                        <button
                            onClick={transferTokens}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105"
                        >
                            转账
                        </button>
                    </div>

                    {/* 错误信息 */}
                    {error && (
                        <div className="bg-red-500 bg-opacity-20 p-3 rounded-lg text-red-300 text-center">
                            {error}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AppTest4;