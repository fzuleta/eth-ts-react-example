require('babel-register');
require('babel-polyfill');
require('ts-node/register');
// require('tsconfig-paths/register');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  // contracts_directory: './contracts/',
  // contracts_build_directory: './../client/src/abis/',
  compilers: {
    solc: {
      version: "^0.8",
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  mocha: {
    useColors: true
  }
}
