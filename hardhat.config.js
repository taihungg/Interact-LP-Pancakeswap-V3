/** @type import('hardhat/config').HardhatUserConfig */
require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: "0.8.20",
  networks: {
    hardhat: {
      forking: {
        url: "https://base.gateway.tenderly.co/7OTzo3fbDpf8IsG6r9a0Q5",
        // Không chỉ định blockNumber để lấy block mới nhất
        // Điều này giúp tránh lỗi liên quan đến hardfork
      },
      chainId: 8453, // Chain ID của Base
      hardfork: "shanghai", // Base network sử dụng hardfork Shanghai
      accounts: {
        mnemonic: "test test test test test test test test test test test junk",
        path: "m/44'/60'/0'/0",
        count: 20,
        accountsBalance: "10000000000000000000000" // 10000 ETH
      }
    },
  },
  // Thêm các cấu hình cho ethers để xử lý timeout và retry
  mocha: {
    timeout: 100000 // Tăng timeout lên 100 giây
  }
};