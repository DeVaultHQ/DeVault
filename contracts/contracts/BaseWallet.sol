// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./Verifier.sol";

abstract contract BaseWallet {
    // primary key hash
    uint private immutable _keyHash;

    // master password hash
    uint private _passwordHash;

    // verify lib
    Verifier private _verifier;

    // nonce
    uint private _nonce;

    event UpdatePasswordHash(
        uint oldPasswordHash,
        uint newPasswordHash,
        uint nonce
    );

    constructor(uint keyHash, uint passwordHash) {
        _keyHash = keyHash;
        _passwordHash = passwordHash;
        _verifier = new Verifier();
        _nonce = 0; // nonce start from 0
    }

    // == update functions ==

    // @notice NO PERMISSION CHECK
    function _updatePasswordHash(uint passwordHash) internal virtual {
        emit UpdatePasswordHash(_passwordHash, passwordHash, _nonce);
        _passwordHash = passwordHash;
        _increaseNonce();
    }

    // @notice NO PERMISSION CHECK
    function _increaseNonce() internal {
        _nonce = _nonce + 1;
    }

    // TODO: execute
    // TODO: execute batch

    // == view functions ==

    function getNonce() public view returns (uint) {
        return _nonce;
    }

    function getKeyHash() public view returns (uint) {
        return _keyHash;
    }

    function getPasswordHash() public view returns (uint) {
        return _passwordHash;
    }

    // == util function ==

    function verifyProof(
        uint[8] memory proof,
        uint pwdhash,
        uint fullhash, //254b
        uint allhash
    ) public view returns (bool) {
        return
        _verifier.verifyProof(
            [proof[0], proof[1]],
            [[proof[2], proof[3]], [proof[4], proof[5]]],
            [proof[6], proof[7]],
            [pwdhash, fullhash, allhash]
        );
    }
}
