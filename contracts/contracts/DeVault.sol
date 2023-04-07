// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./BaseWallet.sol";

// TODO: implement ERC4337
contract DeVault is BaseWallet {

    // map of vault key and value
    mapping(uint => string) private _vaults;

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
            "DeVault::operation expired"
        );

        uint nonce = getNonce();
        // TODO: add function signature
        uint dataHash = uint(keccak256(abi.encodePacked(vaultKeyHash, vaultValue)));
        uint fullHash = uint(keccak256(abi.encodePacked(expiration, block.chainid, nonce, dataHash))) / 8; // 256b->254b
        require(
            verifyProof(proofs, getPasswordHash(), fullHash, allHash),
            "DeVault:: verify proof fail"
        );

        emit SetVault(vaultKeyHash, vaultValue, nonce);

        _vaults[vaultKeyHash] = vaultValue;
        _increaseNonce();
    }

    // == view functions ==

    function getVault(uint vaultKeyHash) public view returns (string memory) {
        return _vaults[vaultKeyHash];
    }

    // == recover ==

    event SetRecover(
        address[] guardians,
        uint needGuardiansNum,
        uint nonce
    );

    address[] public guardians;
    uint public needGuardiansNum;
    address[] public doneGuardians;
    uint public preparePasswordHash;

    function setRecover(
        address[] memory _guardians,
        uint _needGuardiansNum,
        uint[8] memory proofs,
        uint expiration,
        uint allHash
    ) external {
        require(
            _needGuardiansNum > 0 && _needGuardiansNum <= _guardians.length,
            "DeVault:: needGuardiansNum error"
        );

        uint nonce = getNonce();

        uint dataHash = uint(keccak256(abi.encodePacked(_guardians, _needGuardiansNum)));
        uint fullHash = uint(keccak256(abi.encodePacked(expiration, block.chainid, nonce, dataHash))) / 8;

        require(
            verifyProof(proofs, getPasswordHash(), fullHash, allHash),
            "DeVault:: verify proof fail"
        );

        guardians = _guardians;
        needGuardiansNum = _needGuardiansNum;
        doneGuardians = new address[](_needGuardiansNum);

        emit SetRecover(_guardians, needGuardiansNum, nonce);

        _increaseNonce();
    }

    function getRecover() public view returns (
        address[] memory,
        uint,
        address[] memory
    )
    {
        return (guardians, needGuardiansNum, doneGuardians);
    }
}
