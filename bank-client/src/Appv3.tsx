import React, { useState } from 'react';
import { ethers } from 'ethers';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';
import { abi as ERC20_ABI } from './abis/ERC20.json';
import { abi as Bank_ABI } from './abis/Bank.json';

// Configuration
const TOKEN_ADDRESS = '0xYourZ0TokenAddress'; // Replace with your Z0 token contract address

const BANK_ADDRESS = '0xYourBankAddress'; // Replace with your bank contract address
const CHAINS = [
    {
        chainId: '0x7A69', // Hardhat Local (31337)
        name: 'Hardhat Local',
        rpcUrl: 'http://127.0.0.1:8545',
    },
    {
        chainId: '0x1', // Ethereum Mainnet
        name: 'Ethereum Mainnet',
        rpcUrl: 'https://mainnet.infura.io/v3/YOUR_INFURA_KEY',
    },
    {
        chainId: '0x5', // Goerli Testnet
        name: 'Goerli Testnet',
        rpcUrl: 'https://goerli.infura.io/v3/YOUR_INFURA_KEY',
    },
];

// Web3Modal configuration
const projectId = 'YOUR_WALLETCONNECT_PROJECT_ID'; // Replace with your WalletConnect project ID
const metadata = {
    name: 'Z0 Bank DApp',
    description: 'A decentralized bank for Z0 tokens',
    url: 'https://your-dapp-url.com',
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

const web3Modal = createWeb3Modal({
    ethersConfig,
    chains: chainsConfig,
    projectId,
    themeMode: 'dark',
});

const App: React.FC = () => {
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

    // Initialize wallet connection
    const connectWallet = async () => {
        try {
            // web3Modal.connect() returns an EIP-1193 provider
            const modalProvider = await web3Modal.connect();

            const web3Provider = new ethers.BrowserProvider(modalProvider);
            const signer = await web3Provider.getSigner();
            const address = await signer.getAddress();
            const network = await web3Provider.getNetwork();
            const chainIdHex = ethers.hexlify(network.chainId.toString());

            setProvider(web3Provider);
            setSigner(signer);
            setAccount(address);
            setChainId(chainIdHex);

            // Initialize contracts
            const token = new ethers.Contract(TOKEN_ADDRESS, ERC20_ABI, signer);
            const bank = new ethers.Contract(BANK_ADDRESS, Bank_ABI, signer);
            setTokenContract(token);
            setBankContract(bank);

            // Handle account and chain changes
            modalProvider.on('accountsChanged', (accounts: string[]) => {
                setAccount(accounts[0] || '');
            });
            modalProvider.on('chainChanged', (newChainId: string) => {
                setChainId(newChainId);
                window.location.reload();
            });
        } catch (err: any) {
            setError('Failed to connect wallet');
            console.error(err);
        }
    };

    // Switch chain
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
                setError('Failed to switch chain');
                console.error(err);
            }
        }
    };

    // Approve bank to spend tokens
    const approveBank = async () => {
        try {
            if (!amount) throw new Error('Enter amount');
            const tx = await tokenContract?.approve(BANK_ADDRESS, ethers.parseEther(amount));
            await tx.wait();
            alert('Approval successful');
            setAmount('');
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    // Deposit tokens to bank
    const depositTokens = async () => {
        try {
            if (!amount) throw new Error('Enter amount');
            const tx = await bankContract?.deposit(ethers.parseEther(amount));
            await tx.wait();
            alert('Deposit successful');
            setAmount('');
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    // Withdraw tokens from bank
    const withdrawTokens = async () => {
        try {
            if (!amount) throw new Error('Enter amount');
            const tx = await bankContract?.withdraw(ethers.parseEther(amount));
            await tx.wait();
            alert('Withdrawal successful');
            setAmount('');
        } catch (err: any) {
            setError(err.message);
            console.error(err);
        }
    };

    // Transfer tokens within bank
    const transferTokens = async () => {
        try {
            if (!amount || !recipient) throw new Error('Enter amount and recipient');
            const tx = await bankContract?.transfer(recipient, ethers.parseEther(amount));
            await tx.wait();
            alert('Transfer successful');
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

            {/* Wallet Connection */}
            {!account ? (
                <button
                    onClick={connectWallet}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Connect Wallet
                </button>
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <p>Connected: {account.slice(0, 6)}...{account.slice(-4)}</p>

                    {/* Chain Selection */}
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

                    {/* Amount Input */}
                    <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Amount (Z0)"
                        className="bg-gray-800 text-white p-2 rounded w-64"
                    />

                    {/* Approve Button */}
                    <button
                        onClick={approveBank}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Approve Bank
                    </button>

                    {/* Deposit Button */}
                    <button
                        onClick={depositTokens}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Deposit
                    </button>

                    {/* Withdraw Button */}
                    <button
                        onClick={withdrawTokens}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                    >
                        Withdraw
                    </button>

                    {/* Transfer Section */}
                    <div className="flex flex-col items-center space-y-2">
                        <input
                            type="text"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Recipient Address"
                            className="bg-gray-800 text-white p-2 rounded w-64"
                        />
                        <button
                            onClick={transferTokens}
                            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Transfer
                        </button>
                    </div>

                    {/* Error Message */}
                    {error && <p className="text-red-500">{error}</p>}
                </div>
            )}
        </div>
    );
};

export default App;