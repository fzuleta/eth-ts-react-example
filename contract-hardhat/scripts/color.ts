import { Contract } from "@ethersproject/contracts";
import { run, ethers } from "hardhat";
import fs from 'fs';
import path from 'path';

declare const artifacts: any;

const contractName = "Color";

async function main() {
  await run("compile");
  
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", await deployer.getAddress());
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const contractFactory = await ethers.getContractFactory(contractName);
  const contract = await contractFactory.deploy();
  await contract.deployed();

  console.log(`${contractName} address:`, contract.address);

  // We also save the contract's artifacts and address in the frontend directory
  saveFrontendFiles(contract);
}
  
function saveFrontendFiles(contract: Contract) {
  let contractsDir = path.join(__dirname, '..', '..', 'client', 'src', 'abi');
  !fs.existsSync(contractsDir) && fs.mkdirSync(contractsDir);
  fs.writeFileSync(path.join(contractsDir, `${contractName}-address.json`), JSON.stringify({ 'address': contract.address }, undefined, 2) );
  const Artifact = artifacts.readArtifactSync(contractName);
  fs.writeFileSync(path.join(contractsDir, `${contractName}.json`), JSON.stringify(Artifact, null, 2) );
}
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });