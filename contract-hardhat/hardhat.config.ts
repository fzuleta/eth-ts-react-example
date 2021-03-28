import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";
import "hardhat-abi-exporter";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (args, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(await account.address);
  }
});

export default {
  solidity: "0.8.3",
  networks: {
    ganache: {
      url: "http://localhost:7545",
      chainId: 1337,
      accounts: ['d2faed43e6763b00b60b5706ba70db19ac5b79d33193b889daa929d1397a7ee7']
    }
  },
  mocha: {
    timeout: 20000
  }
};
