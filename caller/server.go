package main

import (
	"bytes"
	"context"
	"encoding/json"
	"flag"
	"fmt"
	devault "github.com/DeVaultHQ/caller/abi"
	"github.com/ethereum/go-ethereum/accounts/abi/bind"
	"github.com/ethereum/go-ethereum/common"
	"github.com/ethereum/go-ethereum/common/hexutil"
	"github.com/ethereum/go-ethereum/crypto"
	"github.com/ethereum/go-ethereum/ethclient"
	"io"
	"log"
	"math/big"
	"net/http"
)

var (
	port       int64
	rpc        string
	privateKey string
)

func init() {
	flag.Int64Var(&port, "port", 8080, "The server port")
	flag.StringVar(&rpc, "rpc", "https://alpha-rpc.scroll.io/l2", "The Sroll RPC endpoint")
	flag.StringVar(&privateKey, "pk", "", "The private key")
}

func main() {
	flag.Parse()

	client, err := ethclient.Dial(rpc)
	if err != nil {
		log.Fatal("Error connecting to Ethereum")
	}

	privateKey, err := crypto.HexToECDSA(privateKey)
	if err != nil {
		log.Fatal(err)
	}

	chainId, err := client.ChainID(context.Background())
	if err != nil {
		log.Fatal(err)
	}
	auth, err := bind.NewKeyedTransactorWithChainID(privateKey, chainId)
	if err != nil {
		log.Fatal(err)
	}

	http.HandleFunc("/", handleRequest(auth, client))
	log.Fatal(http.ListenAndServe(fmt.Sprintf(":%d", port), nil))
}

func handleRequest(opts *bind.TransactOpts, client *ethclient.Client) func(w http.ResponseWriter, r *http.Request) {
	return func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
			return
		}

		body, err := io.ReadAll(r.Body)
		if err != nil {
			http.Error(w, "Error reading request body", http.StatusBadRequest)
			return
		}

		var requestData struct {
			Contract   string   `json:"contract"`
			Proof      []string `json:"proof"`
			Expiration string   `json:"expiration"`
			AllHash    string   `json:"allhash"`
			Dest       string   `json:"dest"`
			Value      string   `json:"value"`
			Func       string   `json:"func"`
		}

		err = json.Unmarshal(body, &requestData)
		if err != nil {
			http.Error(w, "Error decoding request body", http.StatusBadRequest)
			return
		}

		proof := [8]*big.Int{}
		if len(requestData.Proof) != 8 {
			http.Error(w, "Invalid proof", http.StatusBadRequest)
			return
		}
		for i, p := range requestData.Proof {
			intP := new(big.Int)
			intP.SetString(p, 10)
			proof[i] = intP
		}

		expiration := new(big.Int)
		expiration.SetString(requestData.Expiration, 10)

		allHash := new(big.Int)
		allHash.SetString(requestData.AllHash, 10)

		dest := common.HexToAddress(requestData.Dest)

		value := new(big.Int)
		value.SetString(requestData.Value, 10)

		funcBytes, err := hexutil.Decode(requestData.Func)
		if err != nil {
			http.Error(w, "Error decoding function data", http.StatusBadRequest)
			return
		}

		contractAddress := common.HexToAddress(requestData.Contract)
		deVault, err := devault.NewDevault(contractAddress, client)
		if err != nil {
			log.Fatal("Error creating contract instance")
		}

		// Call the contract function with the provided parameters
		tx, err := deVault.Execute(opts, proof, expiration, allHash, dest, value, funcBytes)
		if err != nil {
			http.Error(w, fmt.Sprintf("Error calling contract function: %v", err), http.StatusInternalServerError)
			return
		}

		// Return the transaction hash to the client
		responseData := map[string]string{
			"txHash": tx.Hash().Hex(),
		}

		responseBytes, err := json.Marshal(responseData)
		if err != nil {
			http.Error(w, "Error encoding response data", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(bytes.NewBuffer(responseBytes).Bytes())
	}
}
