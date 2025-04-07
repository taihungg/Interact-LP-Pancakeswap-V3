// scripts/interact-pancake.js
const { ethers, network } = require("hardhat");

async function main() {
  console.log("Bắt đầu tương tác với PancakeV3Interaction...");

  // Lấy địa chỉ contract PancakeV3Interaction đã deploy
  const pancakeV3InteractionAddress = "0xC1dC7a8379885676a6Ea08E67b7Defd9a235De71";

  // Lấy contract instance
  const PancakeV3Interaction = await ethers.getContractFactory("PancakeV3Interaction");
  const interaction = await PancakeV3Interaction.attach(pancakeV3InteractionAddress);

  // Lấy thông tin cơ bản
  const token0 = await interaction.token0();
  const token1 = await interaction.token1();
  console.log(`Token0: ${token0}`);
  console.log(`Token1: ${token1}`);

  // Tìm một địa chỉ giàu có có token0 và token1
  // Đây là một địa chỉ giả định, bạn cần thay bằng địa chỉ thực có token
  const richAddress = "0x7501bc8Bb51616F79bfA524E464fb7B41f0B10fB";

  try {
    // Impersonate tài khoản giàu có
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [richAddress],
    });
    console.log(`Đã impersonate địa chỉ: ${richAddress}`);

    // Lấy signer cho tài khoản đã impersonate
    const signer = await ethers.provider.getSigner(richAddress);
    
    // Kết nối contract với signer mới
    const connectedInteraction = interaction.connect(signer);
    
    // Lấy balance token của tài khoản giàu có
    const token0Contract = await ethers.getContractAt("IERC20", token0);
    const token1Contract = await ethers.getContractAt("IERC20", token1);
    
    const token0Balance = await token0Contract.balanceOf(richAddress);
    const token1Balance = await token1Contract.balanceOf(richAddress);
    
    console.log(`Balance Token0: ${ethers.utils.formatUnits(token0Balance, 18)}`);
    console.log(`Balance Token1: ${ethers.utils.formatUnits(token1Balance, 18)}`);
    
    // Approve cho contract sử dụng token
    const amountToSwap = ethers.utils.parseUnits("0.1", 18); // 0.1 token
    await token0Contract.connect(signer).approve(pancakeV3InteractionAddress, amountToSwap);
    console.log(`Đã approve ${ethers.utils.formatUnits(amountToSwap, 18)} token0`);
    
    // Lấy thông tin từ PancakeV3Pool để chuẩn bị swap
    const poolAddress = await interaction.pancakeV3Pool();
    const pool = await ethers.getContractAt("IPancakeV3Pool", poolAddress);
    
    // Lấy giá hiện tại từ pool
    const slot0 = await pool.slot0();
    const currentSqrtPrice = slot0.sqrtPriceX96;
    
    // Tính toán giới hạn giá cho swap (ví dụ: cho phép slippage 1%)
    // Đây là một cách tính đơn giản, trong thực tế bạn cần tính toán chính xác hơn
    const zeroForOne = true; // swap token0 -> token1
    const sqrtPriceLimitX96 = zeroForOne 
      ? currentSqrtPrice.mul(99).div(100) // Giảm 1% nếu swap 0->1
      : currentSqrtPrice.mul(101).div(100); // Tăng 1% nếu swap 1->0
    
    console.log("Current sqrtPrice:", currentSqrtPrice.toString());
    console.log("Price limit:", sqrtPriceLimitX96.toString());
    
    // Thực hiện swap
    console.log("Thực hiện swap...");
    const tx = await connectedInteraction.swapTokens(
      zeroForOne,
      amountToSwap,
      sqrtPriceLimitX96
    );
    
    const receipt = await tx.wait();
    console.log(`Swap thành công! Transaction hash: ${receipt.transactionHash}`);
    
    // Kiểm tra balance sau swap
    const token0BalanceAfter = await token0Contract.balanceOf(richAddress);
    const token1BalanceAfter = await token1Contract.balanceOf(richAddress);
    
    console.log(`Balance Token0 sau swap: ${ethers.utils.formatUnits(token0BalanceAfter, 18)}`);
    console.log(`Balance Token1 sau swap: ${ethers.utils.formatUnits(token1BalanceAfter, 18)}`);
    
    // Ngừng impersonate
    await network.provider.request({
      method: "hardhat_stopImpersonatingAccount",
      params: [richAddress],
    });
    
  } catch (error) {
    console.error("Lỗi khi tương tác với contract:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });