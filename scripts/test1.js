async function main() {
    // Kết nối với mạng Hardhat hoặc Localhost
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Địa chỉ hợp đồng đã triển khai (ví dụ bạn có thể lấy từ kết quả deploy)
    const pancakeV3InteractionAddress = "0xC1dC7a8379885676a6Ea08E67b7Defd9a235De71";  // Địa chỉ hợp đồng của bạn
    const pancakeV3Interaction = await ethers.getContractAt("PancakeV3Interaction", pancakeV3InteractionAddress);
  
    // In ra thông tin về token0 và token1
    const token0 = await pancakeV3Interaction.token0();
    const token1 = await pancakeV3Interaction.token1();
    console.log("Token0:", token0);
    console.log("Token1:", token1);
  
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  