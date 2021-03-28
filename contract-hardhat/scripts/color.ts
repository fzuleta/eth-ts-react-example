import { run, ethers } from "hardhat";

async function main() {
  await run("compile");
  
  const [deployer] = await ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );
  
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Color = await ethers.getContractFactory("Color");
  const color = await Color.deploy();

  console.log("Color address:", color.address);
}
  
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });