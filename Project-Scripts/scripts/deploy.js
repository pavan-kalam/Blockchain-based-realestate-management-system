const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const TokenLand = await ethers.getContractFactory("TokenLand");
  const tokenLand = await TokenLand.deploy(deployer.address);

  await tokenLand.deployed();

  console.log("TokenLand deployed to:", tokenLand.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });