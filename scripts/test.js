async function main() {
    // Lấy tài khoản triển khai
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
  
    // Địa chỉ của hợp đồng PancakeV3Pool đã triển khai
    const pancakeV3PoolAddress = "0xC1dC7a8379885676a6Ea08E67b7Defd9a235De71";  // Thay địa chỉ của bạn ở đây
  
    // Lấy hợp đồng PancakeV3Pool
    const pancakeV3Pool = await ethers.getContractAt("IPancakeV3Pool", pancakeV3PoolAddress);
  
    // Lấy địa chỉ token0 và token1 từ pool
    const token0 = await pancakeV3Pool.token0();
    const token1 = await pancakeV3Pool.token1();
  
    // In ra địa chỉ của hai token trong pool
    console.log("Token0 address:", token0);
    console.log("Token1 address:", token1);
  }
  
  // Chạy script
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  