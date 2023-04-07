import { ethers } from "hardhat";

async function main() {

  const DeVaultFactory = await ethers.getContractFactory("DeVaultFactory");
  const deVaultFactory = await DeVaultFactory.deploy();
  await deVaultFactory.deployed();

  console.log("DeVaultFactory deployed to:", deVaultFactory.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
