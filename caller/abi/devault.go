// Code generated - DO NOT EDIT.
// This file is a generated binding and any manual changes will be lost.

package devault

import (
	"errors"
	"math/big"
	"strings"

	ethereum "github.com/ethereum/go-ethereum"
	"github.com/ethereum/go-ethereum/accounts/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/core/types"
	"github.com/ethereum/go-ethereum/event"
)

// Reference imports to suppress errors if they are not otherwise used.
var (
	_ = errors.New
	_ = big.NewInt
	_ = strings.NewReader
	_ = ethereum.NotFound
	_ = bind.Bind
	_ = common.Big1
	_ = types.BloomLookup
	_ = event.NewSubscription
	_ = abi.ConvertType
)

// DevaultMetaData contains all meta data concerning the Devault contract.
var DevaultMetaData = &bind.MetaData{
	ABI: "[{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"keyHash\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"passwordHash\",\"type\":\"uint256\"}],\"stateMutability\":\"nonpayable\",\"type\":\"constructor\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":true,\"internalType\":\"uint256\",\"name\":\"key\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"string\",\"name\":\"value\",\"type\":\"string\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"}],\"name\":\"SetVault\",\"type\":\"event\"},{\"anonymous\":false,\"inputs\":[{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"oldPasswordHash\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"newPasswordHash\",\"type\":\"uint256\"},{\"indexed\":false,\"internalType\":\"uint256\",\"name\":\"nonce\",\"type\":\"uint256\"}],\"name\":\"UpdatePasswordHash\",\"type\":\"event\"},{\"inputs\":[{\"internalType\":\"uint256[8]\",\"name\":\"proof\",\"type\":\"uint256[8]\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"allhash\",\"type\":\"uint256\"},{\"internalType\":\"address\",\"name\":\"dest\",\"type\":\"address\"},{\"internalType\":\"uint256\",\"name\":\"value\",\"type\":\"uint256\"},{\"internalType\":\"bytes\",\"name\":\"func\",\"type\":\"bytes\"}],\"name\":\"execute\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[8]\",\"name\":\"proof\",\"type\":\"uint256[8]\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"allhash\",\"type\":\"uint256\"},{\"internalType\":\"address[]\",\"name\":\"dest\",\"type\":\"address[]\"},{\"internalType\":\"bytes[]\",\"name\":\"func\",\"type\":\"bytes[]\"}],\"name\":\"executeBatch\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getKeyHash\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getNonce\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[],\"name\":\"getPasswordHash\",\"outputs\":[{\"internalType\":\"uint256\",\"name\":\"\",\"type\":\"uint256\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vaultKeyHash\",\"type\":\"uint256\"}],\"name\":\"getVault\",\"outputs\":[{\"internalType\":\"string\",\"name\":\"\",\"type\":\"string\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256\",\"name\":\"vaultKeyHash\",\"type\":\"uint256\"},{\"internalType\":\"string\",\"name\":\"vaultValue\",\"type\":\"string\"},{\"internalType\":\"uint256[8]\",\"name\":\"proofs\",\"type\":\"uint256[8]\"},{\"internalType\":\"uint256\",\"name\":\"expiration\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"allHash\",\"type\":\"uint256\"}],\"name\":\"setVault\",\"outputs\":[],\"stateMutability\":\"nonpayable\",\"type\":\"function\"},{\"inputs\":[{\"internalType\":\"uint256[8]\",\"name\":\"proof\",\"type\":\"uint256[8]\"},{\"internalType\":\"uint256\",\"name\":\"pwdhash\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"fullhash\",\"type\":\"uint256\"},{\"internalType\":\"uint256\",\"name\":\"allhash\",\"type\":\"uint256\"}],\"name\":\"verifyProof\",\"outputs\":[{\"internalType\":\"bool\",\"name\":\"\",\"type\":\"bool\"}],\"stateMutability\":\"view\",\"type\":\"function\"},{\"stateMutability\":\"payable\",\"type\":\"receive\"}]",
}

// DevaultABI is the input ABI used to generate the binding from.
// Deprecated: Use DevaultMetaData.ABI instead.
var DevaultABI = DevaultMetaData.ABI

// Devault is an auto generated Go binding around an Ethereum contract.
type Devault struct {
	DevaultCaller     // Read-only binding to the contract
	DevaultTransactor // Write-only binding to the contract
	DevaultFilterer   // Log filterer for contract events
}

// DevaultCaller is an auto generated read-only Go binding around an Ethereum contract.
type DevaultCaller struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DevaultTransactor is an auto generated write-only Go binding around an Ethereum contract.
type DevaultTransactor struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DevaultFilterer is an auto generated log filtering Go binding around an Ethereum contract events.
type DevaultFilterer struct {
	contract *bind.BoundContract // Generic contract wrapper for the low level calls
}

// DevaultSession is an auto generated Go binding around an Ethereum contract,
// with pre-set call and transact options.
type DevaultSession struct {
	Contract     *Devault          // Generic contract binding to set the session for
	CallOpts     bind.CallOpts     // Call options to use throughout this session
	TransactOpts bind.TransactOpts // Transaction auth options to use throughout this session
}

// DevaultCallerSession is an auto generated read-only Go binding around an Ethereum contract,
// with pre-set call options.
type DevaultCallerSession struct {
	Contract *DevaultCaller // Generic contract caller binding to set the session for
	CallOpts bind.CallOpts  // Call options to use throughout this session
}

// DevaultTransactorSession is an auto generated write-only Go binding around an Ethereum contract,
// with pre-set transact options.
type DevaultTransactorSession struct {
	Contract     *DevaultTransactor // Generic contract transactor binding to set the session for
	TransactOpts bind.TransactOpts  // Transaction auth options to use throughout this session
}

// DevaultRaw is an auto generated low-level Go binding around an Ethereum contract.
type DevaultRaw struct {
	Contract *Devault // Generic contract binding to access the raw methods on
}

// DevaultCallerRaw is an auto generated low-level read-only Go binding around an Ethereum contract.
type DevaultCallerRaw struct {
	Contract *DevaultCaller // Generic read-only contract binding to access the raw methods on
}

// DevaultTransactorRaw is an auto generated low-level write-only Go binding around an Ethereum contract.
type DevaultTransactorRaw struct {
	Contract *DevaultTransactor // Generic write-only contract binding to access the raw methods on
}

// NewDevault creates a new instance of Devault, bound to a specific deployed contract.
func NewDevault(address common.Address, backend bind.ContractBackend) (*Devault, error) {
	contract, err := bindDevault(address, backend, backend, backend)
	if err != nil {
		return nil, err
	}
	return &Devault{DevaultCaller: DevaultCaller{contract: contract}, DevaultTransactor: DevaultTransactor{contract: contract}, DevaultFilterer: DevaultFilterer{contract: contract}}, nil
}

// NewDevaultCaller creates a new read-only instance of Devault, bound to a specific deployed contract.
func NewDevaultCaller(address common.Address, caller bind.ContractCaller) (*DevaultCaller, error) {
	contract, err := bindDevault(address, caller, nil, nil)
	if err != nil {
		return nil, err
	}
	return &DevaultCaller{contract: contract}, nil
}

// NewDevaultTransactor creates a new write-only instance of Devault, bound to a specific deployed contract.
func NewDevaultTransactor(address common.Address, transactor bind.ContractTransactor) (*DevaultTransactor, error) {
	contract, err := bindDevault(address, nil, transactor, nil)
	if err != nil {
		return nil, err
	}
	return &DevaultTransactor{contract: contract}, nil
}

// NewDevaultFilterer creates a new log filterer instance of Devault, bound to a specific deployed contract.
func NewDevaultFilterer(address common.Address, filterer bind.ContractFilterer) (*DevaultFilterer, error) {
	contract, err := bindDevault(address, nil, nil, filterer)
	if err != nil {
		return nil, err
	}
	return &DevaultFilterer{contract: contract}, nil
}

// bindDevault binds a generic wrapper to an already deployed contract.
func bindDevault(address common.Address, caller bind.ContractCaller, transactor bind.ContractTransactor, filterer bind.ContractFilterer) (*bind.BoundContract, error) {
	parsed, err := DevaultMetaData.GetAbi()
	if err != nil {
		return nil, err
	}
	return bind.NewBoundContract(address, *parsed, caller, transactor, filterer), nil
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Devault *DevaultRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Devault.Contract.DevaultCaller.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Devault *DevaultRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Devault.Contract.DevaultTransactor.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Devault *DevaultRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Devault.Contract.DevaultTransactor.contract.Transact(opts, method, params...)
}

// Call invokes the (constant) contract method with params as input values and
// sets the output to result. The result type might be a single field for simple
// returns, a slice of interfaces for anonymous returns and a struct for named
// returns.
func (_Devault *DevaultCallerRaw) Call(opts *bind.CallOpts, result *[]interface{}, method string, params ...interface{}) error {
	return _Devault.Contract.contract.Call(opts, result, method, params...)
}

// Transfer initiates a plain transaction to move funds to the contract, calling
// its default method if one is available.
func (_Devault *DevaultTransactorRaw) Transfer(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Devault.Contract.contract.Transfer(opts)
}

// Transact invokes the (paid) contract method with params as input values.
func (_Devault *DevaultTransactorRaw) Transact(opts *bind.TransactOpts, method string, params ...interface{}) (*types.Transaction, error) {
	return _Devault.Contract.contract.Transact(opts, method, params...)
}

// GetKeyHash is a free data retrieval call binding the contract method 0x331bf125.
//
// Solidity: function getKeyHash() view returns(uint256)
func (_Devault *DevaultCaller) GetKeyHash(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Devault.contract.Call(opts, &out, "getKeyHash")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetKeyHash is a free data retrieval call binding the contract method 0x331bf125.
//
// Solidity: function getKeyHash() view returns(uint256)
func (_Devault *DevaultSession) GetKeyHash() (*big.Int, error) {
	return _Devault.Contract.GetKeyHash(&_Devault.CallOpts)
}

// GetKeyHash is a free data retrieval call binding the contract method 0x331bf125.
//
// Solidity: function getKeyHash() view returns(uint256)
func (_Devault *DevaultCallerSession) GetKeyHash() (*big.Int, error) {
	return _Devault.Contract.GetKeyHash(&_Devault.CallOpts)
}

// GetNonce is a free data retrieval call binding the contract method 0xd087d288.
//
// Solidity: function getNonce() view returns(uint256)
func (_Devault *DevaultCaller) GetNonce(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Devault.contract.Call(opts, &out, "getNonce")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetNonce is a free data retrieval call binding the contract method 0xd087d288.
//
// Solidity: function getNonce() view returns(uint256)
func (_Devault *DevaultSession) GetNonce() (*big.Int, error) {
	return _Devault.Contract.GetNonce(&_Devault.CallOpts)
}

// GetNonce is a free data retrieval call binding the contract method 0xd087d288.
//
// Solidity: function getNonce() view returns(uint256)
func (_Devault *DevaultCallerSession) GetNonce() (*big.Int, error) {
	return _Devault.Contract.GetNonce(&_Devault.CallOpts)
}

// GetPasswordHash is a free data retrieval call binding the contract method 0x047cced3.
//
// Solidity: function getPasswordHash() view returns(uint256)
func (_Devault *DevaultCaller) GetPasswordHash(opts *bind.CallOpts) (*big.Int, error) {
	var out []interface{}
	err := _Devault.contract.Call(opts, &out, "getPasswordHash")

	if err != nil {
		return *new(*big.Int), err
	}

	out0 := *abi.ConvertType(out[0], new(*big.Int)).(**big.Int)

	return out0, err

}

// GetPasswordHash is a free data retrieval call binding the contract method 0x047cced3.
//
// Solidity: function getPasswordHash() view returns(uint256)
func (_Devault *DevaultSession) GetPasswordHash() (*big.Int, error) {
	return _Devault.Contract.GetPasswordHash(&_Devault.CallOpts)
}

// GetPasswordHash is a free data retrieval call binding the contract method 0x047cced3.
//
// Solidity: function getPasswordHash() view returns(uint256)
func (_Devault *DevaultCallerSession) GetPasswordHash() (*big.Int, error) {
	return _Devault.Contract.GetPasswordHash(&_Devault.CallOpts)
}

// GetVault is a free data retrieval call binding the contract method 0x9403b634.
//
// Solidity: function getVault(uint256 vaultKeyHash) view returns(string)
func (_Devault *DevaultCaller) GetVault(opts *bind.CallOpts, vaultKeyHash *big.Int) (string, error) {
	var out []interface{}
	err := _Devault.contract.Call(opts, &out, "getVault", vaultKeyHash)

	if err != nil {
		return *new(string), err
	}

	out0 := *abi.ConvertType(out[0], new(string)).(*string)

	return out0, err

}

// GetVault is a free data retrieval call binding the contract method 0x9403b634.
//
// Solidity: function getVault(uint256 vaultKeyHash) view returns(string)
func (_Devault *DevaultSession) GetVault(vaultKeyHash *big.Int) (string, error) {
	return _Devault.Contract.GetVault(&_Devault.CallOpts, vaultKeyHash)
}

// GetVault is a free data retrieval call binding the contract method 0x9403b634.
//
// Solidity: function getVault(uint256 vaultKeyHash) view returns(string)
func (_Devault *DevaultCallerSession) GetVault(vaultKeyHash *big.Int) (string, error) {
	return _Devault.Contract.GetVault(&_Devault.CallOpts, vaultKeyHash)
}

// VerifyProof is a free data retrieval call binding the contract method 0x361aad65.
//
// Solidity: function verifyProof(uint256[8] proof, uint256 pwdhash, uint256 fullhash, uint256 allhash) view returns(bool)
func (_Devault *DevaultCaller) VerifyProof(opts *bind.CallOpts, proof [8]*big.Int, pwdhash *big.Int, fullhash *big.Int, allhash *big.Int) (bool, error) {
	var out []interface{}
	err := _Devault.contract.Call(opts, &out, "verifyProof", proof, pwdhash, fullhash, allhash)

	if err != nil {
		return *new(bool), err
	}

	out0 := *abi.ConvertType(out[0], new(bool)).(*bool)

	return out0, err

}

// VerifyProof is a free data retrieval call binding the contract method 0x361aad65.
//
// Solidity: function verifyProof(uint256[8] proof, uint256 pwdhash, uint256 fullhash, uint256 allhash) view returns(bool)
func (_Devault *DevaultSession) VerifyProof(proof [8]*big.Int, pwdhash *big.Int, fullhash *big.Int, allhash *big.Int) (bool, error) {
	return _Devault.Contract.VerifyProof(&_Devault.CallOpts, proof, pwdhash, fullhash, allhash)
}

// VerifyProof is a free data retrieval call binding the contract method 0x361aad65.
//
// Solidity: function verifyProof(uint256[8] proof, uint256 pwdhash, uint256 fullhash, uint256 allhash) view returns(bool)
func (_Devault *DevaultCallerSession) VerifyProof(proof [8]*big.Int, pwdhash *big.Int, fullhash *big.Int, allhash *big.Int) (bool, error) {
	return _Devault.Contract.VerifyProof(&_Devault.CallOpts, proof, pwdhash, fullhash, allhash)
}

// Execute is a paid mutator transaction binding the contract method 0xb288f7d0.
//
// Solidity: function execute(uint256[8] proof, uint256 expiration, uint256 allhash, address dest, uint256 value, bytes func) returns()
func (_Devault *DevaultTransactor) Execute(opts *bind.TransactOpts, proof [8]*big.Int, expiration *big.Int, allhash *big.Int, dest common.Address, value *big.Int, arg5 []byte) (*types.Transaction, error) {
	return _Devault.contract.Transact(opts, "execute", proof, expiration, allhash, dest, value, arg5)
}

// Execute is a paid mutator transaction binding the contract method 0xb288f7d0.
//
// Solidity: function execute(uint256[8] proof, uint256 expiration, uint256 allhash, address dest, uint256 value, bytes func) returns()
func (_Devault *DevaultSession) Execute(proof [8]*big.Int, expiration *big.Int, allhash *big.Int, dest common.Address, value *big.Int, arg5 []byte) (*types.Transaction, error) {
	return _Devault.Contract.Execute(&_Devault.TransactOpts, proof, expiration, allhash, dest, value, arg5)
}

// Execute is a paid mutator transaction binding the contract method 0xb288f7d0.
//
// Solidity: function execute(uint256[8] proof, uint256 expiration, uint256 allhash, address dest, uint256 value, bytes func) returns()
func (_Devault *DevaultTransactorSession) Execute(proof [8]*big.Int, expiration *big.Int, allhash *big.Int, dest common.Address, value *big.Int, arg5 []byte) (*types.Transaction, error) {
	return _Devault.Contract.Execute(&_Devault.TransactOpts, proof, expiration, allhash, dest, value, arg5)
}

// ExecuteBatch is a paid mutator transaction binding the contract method 0x363fb285.
//
// Solidity: function executeBatch(uint256[8] proof, uint256 expiration, uint256 allhash, address[] dest, bytes[] func) returns()
func (_Devault *DevaultTransactor) ExecuteBatch(opts *bind.TransactOpts, proof [8]*big.Int, expiration *big.Int, allhash *big.Int, dest []common.Address, arg4 [][]byte) (*types.Transaction, error) {
	return _Devault.contract.Transact(opts, "executeBatch", proof, expiration, allhash, dest, arg4)
}

// ExecuteBatch is a paid mutator transaction binding the contract method 0x363fb285.
//
// Solidity: function executeBatch(uint256[8] proof, uint256 expiration, uint256 allhash, address[] dest, bytes[] func) returns()
func (_Devault *DevaultSession) ExecuteBatch(proof [8]*big.Int, expiration *big.Int, allhash *big.Int, dest []common.Address, arg4 [][]byte) (*types.Transaction, error) {
	return _Devault.Contract.ExecuteBatch(&_Devault.TransactOpts, proof, expiration, allhash, dest, arg4)
}

// ExecuteBatch is a paid mutator transaction binding the contract method 0x363fb285.
//
// Solidity: function executeBatch(uint256[8] proof, uint256 expiration, uint256 allhash, address[] dest, bytes[] func) returns()
func (_Devault *DevaultTransactorSession) ExecuteBatch(proof [8]*big.Int, expiration *big.Int, allhash *big.Int, dest []common.Address, arg4 [][]byte) (*types.Transaction, error) {
	return _Devault.Contract.ExecuteBatch(&_Devault.TransactOpts, proof, expiration, allhash, dest, arg4)
}

// SetVault is a paid mutator transaction binding the contract method 0xa992070a.
//
// Solidity: function setVault(uint256 vaultKeyHash, string vaultValue, uint256[8] proofs, uint256 expiration, uint256 allHash) returns()
func (_Devault *DevaultTransactor) SetVault(opts *bind.TransactOpts, vaultKeyHash *big.Int, vaultValue string, proofs [8]*big.Int, expiration *big.Int, allHash *big.Int) (*types.Transaction, error) {
	return _Devault.contract.Transact(opts, "setVault", vaultKeyHash, vaultValue, proofs, expiration, allHash)
}

// SetVault is a paid mutator transaction binding the contract method 0xa992070a.
//
// Solidity: function setVault(uint256 vaultKeyHash, string vaultValue, uint256[8] proofs, uint256 expiration, uint256 allHash) returns()
func (_Devault *DevaultSession) SetVault(vaultKeyHash *big.Int, vaultValue string, proofs [8]*big.Int, expiration *big.Int, allHash *big.Int) (*types.Transaction, error) {
	return _Devault.Contract.SetVault(&_Devault.TransactOpts, vaultKeyHash, vaultValue, proofs, expiration, allHash)
}

// SetVault is a paid mutator transaction binding the contract method 0xa992070a.
//
// Solidity: function setVault(uint256 vaultKeyHash, string vaultValue, uint256[8] proofs, uint256 expiration, uint256 allHash) returns()
func (_Devault *DevaultTransactorSession) SetVault(vaultKeyHash *big.Int, vaultValue string, proofs [8]*big.Int, expiration *big.Int, allHash *big.Int) (*types.Transaction, error) {
	return _Devault.Contract.SetVault(&_Devault.TransactOpts, vaultKeyHash, vaultValue, proofs, expiration, allHash)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Devault *DevaultTransactor) Receive(opts *bind.TransactOpts) (*types.Transaction, error) {
	return _Devault.contract.RawTransact(opts, nil) // calldata is disallowed for receive function
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Devault *DevaultSession) Receive() (*types.Transaction, error) {
	return _Devault.Contract.Receive(&_Devault.TransactOpts)
}

// Receive is a paid mutator transaction binding the contract receive function.
//
// Solidity: receive() payable returns()
func (_Devault *DevaultTransactorSession) Receive() (*types.Transaction, error) {
	return _Devault.Contract.Receive(&_Devault.TransactOpts)
}

// DevaultSetVaultIterator is returned from FilterSetVault and is used to iterate over the raw logs and unpacked data for SetVault events raised by the Devault contract.
type DevaultSetVaultIterator struct {
	Event *DevaultSetVault // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DevaultSetVaultIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DevaultSetVault)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DevaultSetVault)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DevaultSetVaultIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DevaultSetVaultIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DevaultSetVault represents a SetVault event raised by the Devault contract.
type DevaultSetVault struct {
	Key   *big.Int
	Value string
	Nonce *big.Int
	Raw   types.Log // Blockchain specific contextual infos
}

// FilterSetVault is a free log retrieval operation binding the contract event 0xf501647fc3b0e755c9a16cb47788f8ac61e07ac1bf2589640e333da386e464aa.
//
// Solidity: event SetVault(uint256 indexed key, string value, uint256 nonce)
func (_Devault *DevaultFilterer) FilterSetVault(opts *bind.FilterOpts, key []*big.Int) (*DevaultSetVaultIterator, error) {

	var keyRule []interface{}
	for _, keyItem := range key {
		keyRule = append(keyRule, keyItem)
	}

	logs, sub, err := _Devault.contract.FilterLogs(opts, "SetVault", keyRule)
	if err != nil {
		return nil, err
	}
	return &DevaultSetVaultIterator{contract: _Devault.contract, event: "SetVault", logs: logs, sub: sub}, nil
}

// WatchSetVault is a free log subscription operation binding the contract event 0xf501647fc3b0e755c9a16cb47788f8ac61e07ac1bf2589640e333da386e464aa.
//
// Solidity: event SetVault(uint256 indexed key, string value, uint256 nonce)
func (_Devault *DevaultFilterer) WatchSetVault(opts *bind.WatchOpts, sink chan<- *DevaultSetVault, key []*big.Int) (event.Subscription, error) {

	var keyRule []interface{}
	for _, keyItem := range key {
		keyRule = append(keyRule, keyItem)
	}

	logs, sub, err := _Devault.contract.WatchLogs(opts, "SetVault", keyRule)
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DevaultSetVault)
				if err := _Devault.contract.UnpackLog(event, "SetVault", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseSetVault is a log parse operation binding the contract event 0xf501647fc3b0e755c9a16cb47788f8ac61e07ac1bf2589640e333da386e464aa.
//
// Solidity: event SetVault(uint256 indexed key, string value, uint256 nonce)
func (_Devault *DevaultFilterer) ParseSetVault(log types.Log) (*DevaultSetVault, error) {
	event := new(DevaultSetVault)
	if err := _Devault.contract.UnpackLog(event, "SetVault", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}

// DevaultUpdatePasswordHashIterator is returned from FilterUpdatePasswordHash and is used to iterate over the raw logs and unpacked data for UpdatePasswordHash events raised by the Devault contract.
type DevaultUpdatePasswordHashIterator struct {
	Event *DevaultUpdatePasswordHash // Event containing the contract specifics and raw log

	contract *bind.BoundContract // Generic contract to use for unpacking event data
	event    string              // Event name to use for unpacking event data

	logs chan types.Log        // Log channel receiving the found contract events
	sub  ethereum.Subscription // Subscription for errors, completion and termination
	done bool                  // Whether the subscription completed delivering logs
	fail error                 // Occurred error to stop iteration
}

// Next advances the iterator to the subsequent event, returning whether there
// are any more events found. In case of a retrieval or parsing error, false is
// returned and Error() can be queried for the exact failure.
func (it *DevaultUpdatePasswordHashIterator) Next() bool {
	// If the iterator failed, stop iterating
	if it.fail != nil {
		return false
	}
	// If the iterator completed, deliver directly whatever's available
	if it.done {
		select {
		case log := <-it.logs:
			it.Event = new(DevaultUpdatePasswordHash)
			if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
				it.fail = err
				return false
			}
			it.Event.Raw = log
			return true

		default:
			return false
		}
	}
	// Iterator still in progress, wait for either a data or an error event
	select {
	case log := <-it.logs:
		it.Event = new(DevaultUpdatePasswordHash)
		if err := it.contract.UnpackLog(it.Event, it.event, log); err != nil {
			it.fail = err
			return false
		}
		it.Event.Raw = log
		return true

	case err := <-it.sub.Err():
		it.done = true
		it.fail = err
		return it.Next()
	}
}

// Error returns any retrieval or parsing error occurred during filtering.
func (it *DevaultUpdatePasswordHashIterator) Error() error {
	return it.fail
}

// Close terminates the iteration process, releasing any pending underlying
// resources.
func (it *DevaultUpdatePasswordHashIterator) Close() error {
	it.sub.Unsubscribe()
	return nil
}

// DevaultUpdatePasswordHash represents a UpdatePasswordHash event raised by the Devault contract.
type DevaultUpdatePasswordHash struct {
	OldPasswordHash *big.Int
	NewPasswordHash *big.Int
	Nonce           *big.Int
	Raw             types.Log // Blockchain specific contextual infos
}

// FilterUpdatePasswordHash is a free log retrieval operation binding the contract event 0x0ba7743895550fd1379311520e1ba54acb13a3cbcd7c7c041eb5d21580eccfbe.
//
// Solidity: event UpdatePasswordHash(uint256 oldPasswordHash, uint256 newPasswordHash, uint256 nonce)
func (_Devault *DevaultFilterer) FilterUpdatePasswordHash(opts *bind.FilterOpts) (*DevaultUpdatePasswordHashIterator, error) {

	logs, sub, err := _Devault.contract.FilterLogs(opts, "UpdatePasswordHash")
	if err != nil {
		return nil, err
	}
	return &DevaultUpdatePasswordHashIterator{contract: _Devault.contract, event: "UpdatePasswordHash", logs: logs, sub: sub}, nil
}

// WatchUpdatePasswordHash is a free log subscription operation binding the contract event 0x0ba7743895550fd1379311520e1ba54acb13a3cbcd7c7c041eb5d21580eccfbe.
//
// Solidity: event UpdatePasswordHash(uint256 oldPasswordHash, uint256 newPasswordHash, uint256 nonce)
func (_Devault *DevaultFilterer) WatchUpdatePasswordHash(opts *bind.WatchOpts, sink chan<- *DevaultUpdatePasswordHash) (event.Subscription, error) {

	logs, sub, err := _Devault.contract.WatchLogs(opts, "UpdatePasswordHash")
	if err != nil {
		return nil, err
	}
	return event.NewSubscription(func(quit <-chan struct{}) error {
		defer sub.Unsubscribe()
		for {
			select {
			case log := <-logs:
				// New log arrived, parse the event and forward to the user
				event := new(DevaultUpdatePasswordHash)
				if err := _Devault.contract.UnpackLog(event, "UpdatePasswordHash", log); err != nil {
					return err
				}
				event.Raw = log

				select {
				case sink <- event:
				case err := <-sub.Err():
					return err
				case <-quit:
					return nil
				}
			case err := <-sub.Err():
				return err
			case <-quit:
				return nil
			}
		}
	}), nil
}

// ParseUpdatePasswordHash is a log parse operation binding the contract event 0x0ba7743895550fd1379311520e1ba54acb13a3cbcd7c7c041eb5d21580eccfbe.
//
// Solidity: event UpdatePasswordHash(uint256 oldPasswordHash, uint256 newPasswordHash, uint256 nonce)
func (_Devault *DevaultFilterer) ParseUpdatePasswordHash(log types.Log) (*DevaultUpdatePasswordHash, error) {
	event := new(DevaultUpdatePasswordHash)
	if err := _Devault.contract.UnpackLog(event, "UpdatePasswordHash", log); err != nil {
		return nil, err
	}
	event.Raw = log
	return event, nil
}
