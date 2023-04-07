// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./DeVault.sol";

contract DeVaultFactory {
    // map of key and devault
    mapping(uint => DeVault) private _devaults;

    event CreateDeVault(
        uint indexed key,
        address indexed devault
    );

    constructor() {}

    function createDeVault(uint keyHash, uint passwordHash) public returns (DeVault) {
        require(address(_devaults[keyHash]) == address(0), "DeVaultFactory: DeVault already exists");
        bytes32 _salt = keccak256(abi.encodePacked(keyHash, passwordHash, block.number));

        DeVault devault = new DeVault{salt: _salt}(keyHash, passwordHash);
        _devaults[keyHash] = devault;

        emit CreateDeVault(keyHash, address(devault));

        return devault;
    }

    function getDeVault(uint keyHash) public view returns (DeVault) {
        return _devaults[keyHash];
    }

}
