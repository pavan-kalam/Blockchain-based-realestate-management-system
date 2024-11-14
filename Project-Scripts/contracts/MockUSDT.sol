// contracts/MockUSDT.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDT is ERC20 {
    constructor() ERC20("Mock USDT", "mUSDT") {
        // Mint 1,000,000 Mock USDT to the deployer
        _mint(msg.sender, 1000000 * 10**decimals());
    }
}