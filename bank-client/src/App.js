import { useState } from "react";
import WalletConnect from "./components/WalletConnect";
import BankInterface from "./components/BankInterface";

function App() {
    const [provider, setProvider] = useState(null);
    const [account, setAccount] = useState(null);
    const [chainId, setChainId] = useState(null);

    return (
        // <div className="bg-light min-vh-100">
        //     <header className="bg-primary text-white p-4">
        //         <h1 className="display-4">Web3 Bank Demo</h1>
        //     </header>
        //     <main className="py-4">
        //         <WalletConnect setProvider={setProvider} setAccount={setAccount} setChainId={setChainId} />
        //         {provider && account && <BankInterface provider={provider} account={account} chainId={chainId} />}
        //     </main>
        // </div>
        <div>HELLO REACT! n</div>
    );
}

export default App;