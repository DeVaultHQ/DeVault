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

    /**
     * execute a transaction (called directly from owner, or by entryPoint)
     */
    function execute(
        uint[8] memory proof,
        uint expiration,
        uint allhash,
        address dest,
        uint256 value,
        bytes calldata func
    ) external {
        uint nonce = getNonce();
        uint dataHash = uint(keccak256(abi.encodePacked(dest, value, func)));
        uint fullHash = uint(keccak256(abi.encodePacked(expiration, block.chainid, nonce, dataHash))) / 8; // 256b->254b

        require(
            verifyProof(proof, getPasswordHash(), fullHash, allhash),
            "BaseWallet:: verify proof fail"
        );
        _increaseNonce();
        _call(dest, value, func);
    }

    /**
     * execute a sequence of transactions
     */
    function executeBatch(
        uint[8] memory proof,
        uint expiration,
        uint allhash,
        address[] calldata dest,
        bytes[] calldata func
    ) external {
        require(dest.length == func.length, "BaseWallet:: wrong array lengths");

        uint nonce = getNonce();
        uint dataHash = uint(keccak256(abi.encodePacked(dest, keccak256(abi.encode(func)))));
        uint fullHash = uint(keccak256(abi.encodePacked(expiration, block.chainid, nonce, dataHash))) / 8; // 256b->254b
        require(
            verifyProof(proof, getPasswordHash(), fullHash, allhash),
            "BaseWallet:: verify proof fail"
        );

        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
            _increaseNonce();
        }
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    receive() external payable {}

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
