import { ethers } from "hardhat";

async function main() {
  const ExampleNFT = await ethers.getContractFactory("ExampleNFT");
  const exampleNFT = await ExampleNFT.deploy();

  await exampleNFT.deployed();

  console.log(`Example NFT has been deployed to ${exampleNFT.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
