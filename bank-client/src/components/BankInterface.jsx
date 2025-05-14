import { useState, useEffect } from "react";
import { ethers } from "ethers";

import { ZERO_ADDRESS, BANK_ADDRESS } from "../utils/constants";
import ZeroABI from "../utils/ZeroABI.json";
import BankABI from "../utils/BankABI.json";
import { Button, Form } from "react-bootstrap";

export default function BankInterface({ provider, account, chainId }) {
    const [balance, setBalance] = useState("0");
    const [depositAmount, setDepositAmount] = useState("");
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [transferAmount, setTransferAmount] = useState("");
    const [transferAddress, setTransferAddress] = useState("");
    const [approveAmount, setApproveAmount] = useState("");

    const getBalance = async () => {
        if (!provider || !account) return;
        const signer = await provider.getSigner();
        const bankContract = new ethers.Contract(BANK_ADDRESS, BankABI, signer);
        const bal = await bankContract.balanceOfAddress();
        setBalance(ethers.formatEther(bal));
    };

    // 授权
    const handleApprove = async () => {
        if (!provider || !account) return;
        const signer = await provider.getSigner();
        const zeroContract = new ethers.Contract(ZERO_ADDRESS, ZeroABI, signer);
        try {
            const tx = await zeroContract.approve(BANK_ADDRESS, ethers.parseEther(approveAmount));
            await tx.wait();
            alert("Approval successful!");
        } catch (error) {
            console.error("Approval failed:", error);
            alert("Approval failed!");
        }
    };

    // 存款
    const handleDeposit = async () => {
        if (!provider || !account) return;
        const signer = await provider.getSigner();
        const bankContract = new ethers.Contract(BANK_ADDRESS, BankABI, signer);
        try {
            const tx = await bankContract.depositToAddress(ethers.parseEther(depositAmount));
            await tx.wait();
            alert("Deposit successful!");
            getBalance();
        } catch (error) {
            console.error("Deposit failed:", error);
            alert("Deposit failed!");
        }
    };

    // 取款
    const handleWithdraw = async () => {
        if (!provider || !account) return;
        const signer = await provider.getSigner();
        const bankContract = new ethers.Contract(BANK_ADDRESS, BankABI, signer);
        try {
            const tx = await bankContract.withdraw(ethers.parseEther(withdrawAmount));
            await tx.wait();
            alert("Withdrawal successful!");
            getBalance();
        } catch (error) {
            console.error("Withdrawal failed:", error);
            alert("Withdrawal failed!");
        }
    };

    // 转账
    const handleTransfer = async () => {
        if (!provider || !account) return;
        const signer = await provider.getSigner();
        const bankContract = new ethers.Contract(BANK_ADDRESS, BankABI, signer);
        try {
            const tx = await bankContract.transferInBank(transferAddress, ethers.parseEther(transferAmount));
            await tx.wait();
            alert("Transfer successful!");
            getBalance();
        } catch (error) {
            console.error("Transfer failed:", error);
            alert("Transfer failed!");
        }
    };

    useEffect(() => {
        if (provider && account) {
            getBalance();
        }
    }, [provider, account]);

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Bank Interface</h2>
            <p className="mb-4">Account: {account || "Not connected"}</p>
            <p className="mb-4">Bank Balance: {balance} Z0</p>
            <p className="mb-4">Chain ID: {chainId || "Not connected"}</p>

            <div className="mb-4">
                <Form.Group>
                    <Form.Label>Approve Amount (Z0)</Form.Label>
                    <Form.Control
                        type="number"
                        value={approveAmount}
                        onChange={(e) => setApproveAmount(e.target.value)}
                        placeholder="Enter amount to approve"
                    />
                </Form.Group>
                <Button variant="success" onClick={handleApprove} className="mt-2">
                    Approve Bank
                </Button>
            </div>

            <div className="mb-4">
                <Form.Group>
                    <Form.Label>Deposit Amount (Z0)</Form.Label>
                    <Form.Control
                        type="number"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                        placeholder="Enter amount to deposit"
                    />
                </Form.Group>
                <Button variant="primary" onClick={handleDeposit} className="mt-2">
                    Deposit
                </Button>
            </div>

            <div className="mb-4">
                <Form.Group>
                    <Form.Label>Withdraw Amount (Z0)</Form.Label>
                    <Form.Control
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount to withdraw"
                    />
                </Form.Group>
                <Button variant="danger" onClick={handleWithdraw} className="mt-2">
                    Withdraw
                </Button>
            </div>

            <div className="mb-4">
                <Form.Group>
                    <Form.Label>Transfer To Address</Form.Label>
                    <Form.Control
                        type="text"
                        value={transferAddress}
                        onChange={(e) => setTransferAddress(e.target.value)}
                        placeholder="Enter recipient address"
                    />
                    <Form.Label className="mt-2">Transfer Amount (Z0)</Form.Label>
                    <Form.Control
                        type="number"
                        value={transferAmount}
                        onChange={(e) => setTransferAmount(e.target.value)}
                        placeholder="Enter amount to transfer"
                    />
                </Form.Group>
                <Button variant="info" onClick={handleTransfer} className="mt-2">
                    Transfer
                </Button>
            </div>
        </div>
    );
}