

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("BankModule", (m) => {
    //const zero = m.getParameter("ZeroModule", "Zero"); // Fetch Zero contract address

    const zero = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const bank = m.contract("Bank", ["0x5FbDB2315678afecb367f032d93F642f64180aa3"]);
    return { bank };
});