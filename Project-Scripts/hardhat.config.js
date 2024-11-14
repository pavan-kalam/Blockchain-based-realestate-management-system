require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.27", // Match the Solidity version of your TokenLand contract
      },
      {
        version: "0.8.20", // Ensure compatibility with OpenZeppelin contracts
      },
    ],
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337, // Local Hardhat network
    },
  },
};
