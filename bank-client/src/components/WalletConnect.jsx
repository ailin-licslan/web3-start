import { useState } from "react";
import { EthereumProvider } from "@walletconnect/ethereum-provider";
import { WalletConnectModal } from "@walletconnect/modal";
import { ethers } from "ethers";

const web3Modal = new WalletConnectModal({
    projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // Replace with your WalletConnect Project ID
    themeMode: "light",
});

export default function WalletConnect({ setProvider, setAccount, setChainId }) {
    const [isConnected, setIsConnected] = useState(false);
    const [chains, setChains] = useState([31337]); // Default to Hardhat local chain

    const connectWallet = async () => {
        try {
            const provider = await EthereumProvider.init({
                projectId: "YOUR_WALLET_CONNECT_PROJECT_ID", // Replace with your WalletConnect Project ID
                chains: chains,
                showQrModal: true,
                methods: ["eth_requestAccounts", "eth_accounts", "wallet_switchEthereumChain"],
                events: ["chainChanged", "accountsChanged"],
            });

            await provider.connect();
            const accounts = provider.accounts;
            if (accounts.length > 0) {
                setProvider(provider);
                setAccount(accounts[0]);
                setChainId(provider.chainId);
                setIsConnected(true);
            }

            // 切换账户
            provider.on("accountsChanged", (accounts) => {
                if (accounts.length > 0) {
                    setAccount(accounts[0]);
                } else {
                    setIsConnected(false);
                    setAccount(null);
                    setProvider(null);
                    setChainId(null);
                }
            });

            // 切换链网络
            provider.on("chainChanged", (chainId) => {
                setChainId(Number(chainId));
                window.location.reload();
            });
        } catch (error) {
            console.error("Wallet connection failed:", error);
        }
    };

    const switchChain = async (chainId) => {
        try {
            const provider = await EthereumProvider.init({
                projectId: "YOUR_WALLET_CONNECT_PROJECT_ID",
                chains: [chainId],
                showQrModal: true,
            });
            await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: ethers.toQuantity(chainId) }],
            });
            setChains([chainId]);
        } catch (error) {
            console.error("Chain switch failed:", error);
        }
    };

    const disconnectWallet = async () => {
        try {
            await web3Modal.closeModal();
            setProvider(null);
            setAccount(null);
            setChainId(null);
            setIsConnected(false);
        } catch (error) {
            console.error("Wallet disconnection failed:", error);
        }
    };

    return (
        <div className="p-4">
            {isConnected ? (
                <div>
                    <button
                        onClick={disconnectWallet}
                        className="btn btn-danger me-2"
                    >
                        Disconnect Wallet
                    </button>
                    <select
                        className="form-select w-auto d-inline-block"
                        onChange={(e) => switchChain(Number(e.target.value))}
                        value={chains[0]}
                    >
                        <option value={31337}>Hardhat Local (31337)</option>
                        <option value={1}>Ethereum Mainnet (1)</option>
                        <option value={5}>Goerli Testnet (5)</option>
                    </select>
                </div>
            ) : (
                <button
                    onClick={connectWallet}
                    className="btn btn-primary"
                >
                    Connect Wallet
                </button>
            )}
        </div>
    );
}