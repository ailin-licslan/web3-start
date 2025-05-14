const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("ZeroModule", (m) => {
    const Zero = m.contract("Zero", ["Zero Token", "Z0"]);
    return { Zero };
});
