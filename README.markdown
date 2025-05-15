# Web3 Bank Demo

A simple Web3 application demonstrating a bank smart contract with deposit, withdrawal, and transfer functionalities using Solidity, Hardhat, Ethers.js, and React.

## Prerequisites
- Node.js (>=23.11.0)
- npm
- MetaMask browser extension
- VS Code (recommended)

## Project Structure
- **bank-contract**: Hardhat project with smart contracts, deployment scripts, and tests.
- **bank-client**: React frontend with Ethers.js and WalletConnect, styled with Bootstrap.

## Setup

### 1. Install Dependencies
```cmd
# Install Hardhat dependencies
cd bank-contract
npm install

# Install React dependencies
cd ../bank-client
npm install ethers@latest @walletconnect/modal@latest @walletconnect/ethereum-provider@latest bootstrap@latest react-bootstrap@latest --legacy-peer-deps
```

### 2. Configure Hardhat Network
Add the Hardhat local network to MetaMask:
- Network Name: Hardhat Local
- New RPC URL: http://127.0.0.1:8545
- Chain ID: 31337
- Currency Symbol: ETH

Import accounts using the mnemonic from `bank-contract/hardhat.config.js`:
```
test test test test test test test test test test test junk
```

### 3. Deploy Contracts
```cmd
cd bank-contract
npx hardhat node
```
In a new terminal:
```cmd
npx hardhat ignition deploy ./ignition/modules/DeployZero.js --network localhost
npx hardhat ignition deploy ./ignition/modules/DeployBank.js --network localhost
npx hardhat compile
```

Copy ABIs and addresses:
- Copy `artifacts/contracts/Zero.sol/Zero.json` to `bank-client/src/utils/ZeroABI.json`.
- Copy `artifacts/contracts/Bank.sol/Bank.json` to `bank-client/src/utils/BankABI.json`.
- Update `bank-client/src/utils/constants.js` with deployed contract addresses.

### 4. Run Tests
```cmd
cd bank-contract
npx hardhat test
```

### 5. Start Frontend
```cmd
cd bank-client
npm start
```
Open `http://localhost:3000` in your browser.

## Usage
1. Connect your wallet (MetaMask or WalletConnect) via the "Connect Wallet" button.
2. Switch chains using the dropdown (e.g., Hardhat Local, Ethereum Mainnet, Goerli Testnet).
3. Approve the bank contract to spend your Z0 tokens.
4. Deposit Z0 tokens to the bank.
5. Withdraw Z0 tokens from the bank.
6. Transfer Z0 tokens to another account within the bank.

## Notes
- Ensure you have sufficient Z0 tokens in your account (minted to the first Hardhat account by default).
- Replace "YOUR_WALLET_CONNECT_PROJECT_ID" in `WalletConnect.tsx` with your WalletConnect Project ID from `https://cloud.walletconnect.com`.
- The UI uses Bootstrap for styling.

## Troubleshooting
- **Transaction fails**: Check if the account has enough ETH (provided by Hardhat node) and Z0 tokens.
- **Approval issues**: Ensure you approve the bank contract before depositing.
- **Network errors**: Verify the Hardhat node is running and MetaMask is connected to the correct network.
- **Dependency warnings**: Use `--legacy-peer-deps` if npm install fails due to peer conflicts.