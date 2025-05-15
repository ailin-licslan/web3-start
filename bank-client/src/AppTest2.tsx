import React, { useState } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig, useWeb3Modal } from '@web3modal/ethers/react';
import { abi as ERC20_ABI } from './abis/ERC20.json';
import { abi as Bank_ABI } from './abis/Bank.json';

// 配置
const TOKEN_ADDRESS = '0xYourZ0TokenAddress'; // 替换为你的 Z0 token 合约地址
const BANK_ADDRESS = '0xYourBankAddress'; // 替换为你的 bank 合约地址
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
    name: 'Z0 Bank DApp',
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

const AppStart: React.FC = () => {
    const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
    // @ts-ignore
    const [signer, setSigner] = useState<ethers.Signer | null>(null);
    const [account, setAccount] = useState<string>('');
    const [chainId, setChainId] = useState<string>('');
    const [tokenContract, setTokenContract] = useState<ethers.Contract | null>(null);
    const [bankContract, setBankContract] = useState<ethers.Contract | null>(null);
    const [amount, setAmount] = useState<string>('');
    const [recipient, setRecipient] = useState<string>('');
    const [error, setError] = useState<string>('');

    // @ts-ignore
    const { open, close } = useWeb3Modal();

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
                const chainIdHex = ethers.hexlify(network.chainId);

                setProvider(web3Provider);
                setSigner(signer);
                setAccount(address);
                setChainId(chainIdHex);

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
            setError('无法连接钱包');
            console.error(err);
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
                setError('无法切换链');
                console.error(err);
            }
        }
    };

    // 授权银行使用 token
    const approveBank = async () => {
        try {
            if (!amount) throw new Error('请输入金额');
            const tx = await tokenContract?.approve(BANK_ADDRESS, ethers.parseEther(amount));
            await tx.wait();
            alert('授权成功');
            setAmount('');
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    // 存款到银行
    const depositTokens = async () => {
        try {
            if (!amount) throw new Error('请输入金额');
            const tx = await bankContract?.deposit(ethers.parseEther(amount));
            await tx.wait();
            alert('存款成功');
            setAmount('');
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    // 从银行取款
    const withdrawTokens = async () => {
        try {
            if (!amount) throw new Error('请输入金额');
            const tx = await bankContract?.withdraw(ethers.parseEther(amount));
            await tx.wait();
            alert('取款成功');
            setAmount('');
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    // 在银行内转账
    const transferTokens = async () => {
        try {
            if (!amount || !recipient) throw new Error('请输入金额和收款地址');
            const tx = await bankContract?.transfer(recipient, ethers.parseEther(amount));
            await tx.wait();
            alert('转账成功');
            setAmount('');
            setRecipient('');
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4">
            <h1 className="text-3xl font-bold mb-6">Z0 Bank DApp</h1>

            {/* 钱包连接 */}
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    连接钱包
                </button>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <p>已连接: {account.slice(0, 6)}...{account.slice(-4)}</p>

                    {/* 链选择 */}
                    <select
                        value={chainId}
                        onChange={(e) => switchChain(e.target.value)}
                        className="bg-gray-800 text-white p-2 rounded"
                    >
                        {CHAINS.map(chain => (
                            <option key={chain.chainId} value={chain.chainId}>
                                {chain.name}
                            </option>
                        ))}
                    </select>

                    {/* 金额输入 */}
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="金额 (Z0)"
                        className="bg-gray-800 text-white p-2 rounded w-64"
                    />

                    {/* 授权按钮 */}
                    <button
                        onClick={approveBank}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        授权银行
                    </button>

                    {/* 存款按钮 */}
                    <button
                        onClick={depositTokens}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        存款
                    </button>

                    {/* 取款按钮 */}
                    <button
                        onClick={withdrawTokens}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                        取款
                    </button>

                    {/* 转账部分 */}
                    <div className="flex flex-col items-center space-y-2">
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="收款地址"
                            className="bg-gray-800 text-white p-2 rounded w-64"
                        />
                        <button
                            onClick={transferTokens}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                        >
                            转账
                        </button>
                    </div>

                    {/* 错误信息 */}
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default AppStart;