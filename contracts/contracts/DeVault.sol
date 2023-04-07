// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./BaseWallet.sol";

// TODO: implement ERC4337
contract DeVault is BaseWallet {

    // map of vault key and value
    mapping(uint => string) private _vaults;
    uint[] private _vaultKeys;

    event SetVault(
        uint indexed key,
        string value,
        uint nonce
    );

    constructor(uint keyHash, uint passwordHash) BaseWallet(keyHash, passwordHash) {}

    // == update functions ==

    function setVault(
        uint vaultKeyHash,
        string memory vaultValue,
        uint[8] memory proofs,
        uint expiration,
        uint allHash
    ) public {
        require(
            block.timestamp < expiration,
            "DeVault:: operation expired"
        );
        require(
            bytes(vaultValue).length > 0,
            "DeVault:: vault value is empty"
        );

        uint nonce = getNonce();
        uint dataHash = uint(keccak256(abi.encodePacked(vaultKeyHash, vaultValue)));
        uint fullHash = uint(keccak256(abi.encodePacked(expiration, block.chainid, nonce, dataHash))) / 8; // 256b->254b
        require(
            verifyProof(proofs, getPasswordHash(), fullHash, allHash),
            "DeVault:: verify proof fail"
        );

        emit SetVault(vaultKeyHash, vaultValue, nonce);

        if (bytes(_vaults[vaultKeyHash]).length == 0) {
            // new key
            _vaultKeys.push(vaultKeyHash);
        }

        _vaults[vaultKeyHash] = vaultValue;
        _increaseNonce();
    }

    // == view functions ==

    function getVault(uint vaultKeyHash) public view returns (string memory) {
        return _vaults[vaultKeyHash];
    }

    function getVaultKeysLength() public view returns (uint) {
        return _vaultKeys.length;
    }

    function getVaultKey(uint index) public view returns (uint) {
        return _vaultKeys[index];
    }
}
