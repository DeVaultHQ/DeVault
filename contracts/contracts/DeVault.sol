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

    // == recover ==

    event SetRecover(
        address[] guardians,
        uint needGuardiansNum,
        uint nonce
    );

    event Cover(
        address indexed operator,
        uint indexed newPasswordHash,
        uint doneNum
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

    function recoverPassword(uint _newPasswordHash) external {
        require(
            _newPasswordHash != getPasswordHash(),
            "DeVault:: newPasswordHash can't be same"
        );

        bool isGuardian;
        for (uint j = 0; j < guardians.length; ++j) {
            if (guardians[j] == msg.sender) {
                isGuardian = true;
                break;
            }
        }
        require(isGuardian, "DeVault:: you're not the Guardian");

        if (preparePasswordHash == _newPasswordHash) {
            uint insertIndex = 0;
            bool insertIndexOnce;
            for (uint i = 0; i < doneGuardians.length; ++i) {
                if (!insertIndexOnce && doneGuardians[i] == address(0)) {
                    insertIndex = i;
                    insertIndexOnce = true;
                }
                require(
                    doneGuardians[i] != msg.sender,
                    "DeVault:: don't repeat"
                );
            }

            if (insertIndex == needGuardiansNum - 1) {
                _updatePasswordHash(_newPasswordHash);
                doneGuardians = new address[](needGuardiansNum); //clear doneGuardians
            } else {
                doneGuardians[insertIndex] = msg.sender;
            }

            emit Cover(msg.sender, _newPasswordHash, insertIndex + 1);
        } else {
            if (needGuardiansNum == 1) {
                _updatePasswordHash(_newPasswordHash);
            } else {
                doneGuardians = new address[](needGuardiansNum);
                doneGuardians[0] = msg.sender;
                preparePasswordHash = _newPasswordHash;
            }

            emit Cover(msg.sender, _newPasswordHash, 1);
        }
    }
}
