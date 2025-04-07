// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IPancakeV3Pool.sol";  

contract PancakeV3Interaction {

    IPancakeV3Pool public pancakeV3Pool;

    // 2 token của pool
    address public token0; 
    address public token1;

    constructor(address _pancakeV3Pool) {
        pancakeV3Pool = IPancakeV3Pool(_pancakeV3Pool);
        token0 = pancakeV3Pool.token0();
        token1 = pancakeV3Pool.token1();
    }

    function addLiquidity(
        int24 tickLower,
        int24 tickUpper,
        uint128 amount
    ) external {
        IERC20(token0).transferFrom(msg.sender, address(this), amount);
        IERC20(token1).transferFrom(msg.sender, address(this), amount);

        pancakeV3Pool.mint(
            msg.sender, // người nhận thanh khoản
            tickLower,  // tick dưới
            tickUpper,  // tick trên
            amount,     // lượng thanh khoản
            ""          // em chưa biết để gì vào call data
        );
    }

    function swapTokens(
        bool zeroForOne, // true: swap token0 -> token1, false: swap token1 -> token0
        int256 amountSpecified, // Số lượng token muốn hoán đổi
        uint160 sqrtPriceLimitX96 // Giới hạn giá (sqrt price)
    ) external {
        if (zeroForOne) {
            IERC20(token0).transferFrom(msg.sender, address(this), uint256(amountSpecified));
        } else {
            IERC20(token1).transferFrom(msg.sender, address(this), uint256(amountSpecified));
        }

        pancakeV3Pool.swap(
            msg.sender, // người nhận token sau swap
            zeroForOne, // hướng hoán đổi
            amountSpecified, // lượng token cần hoán đổi
            sqrtPriceLimitX96, // giới hạn giá
            ""
        );
    }

    // Thu phí từ vị trí thanh khoản
    function collectFees(
        int24 tickLower,
        int24 tickUpper,
        uint128 amount0Requested,
        uint128 amount1Requested
    ) external {
        pancakeV3Pool.collect(
            msg.sender, // người nhận phí
            tickLower, // tick dưới
            tickUpper, // tick trên
            amount0Requested, // số lượng token0 cần thu
            amount1Requested // số lượng token1 cần thu
        );
    }

    function removeLiquidity(
        int24 tickLower,
        int24 tickUpper,
        uint128 amount
    ) external {
        // Gọi hàm burn từ PancakeV3Pool để rút thanh khoản
        pancakeV3Pool.burn(
            tickLower, // tick dưới
            tickUpper, // tick trên
            amount // lượng thanh khoản cần rút
        );
    }
}
