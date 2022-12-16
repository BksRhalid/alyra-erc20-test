const HDWalletProvider = require("@truffle/hdwallet-provider");
require("dotenv").config();

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*",
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(
          `${process.env.PK}`,
          `${process.env.INFURA}`
        );
      },
      network_id: 5,
    },
  },

  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17",
      settings: {
        optimizer: {
          enabled: false,
          runs: 200,
        },
      },
    },
  },
};
