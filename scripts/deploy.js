async function main() {
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    const pancakeV3PoolAddress = "0x708D93fC1C95Fd89ea48A9ca2e2eB13c14f61B54";  // Địa chỉ hợp đồng pool msUSD/USDC
  
    const PancakeV3Interaction = await ethers.getContractFactory("PancakeV3Interaction");
    const pancakeV3Interaction = await PancakeV3Interaction.deploy(pancakeV3PoolAddress);
  
    console.log("PancakeV3Interaction contract deployed to:", pancakeV3Interaction.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  