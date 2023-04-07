import { getProof } from "./proofs";
import { ethers } from "hardhat";
import { utils,  } from "ethers"
import { Provider } from "@ethersproject/providers";

async function main() {
    // generate key and password
    const provider = await getProvider();

    const key = "123";
    const password = "123"; // 9122803577462119899687127722606875692129253646616795853145881385008190728933
    const dataHash = "0"
    const nonce = "0"

    const proof = await getProof(provider, password, key, nonce, dataHash)
    console.log(proof)
}

async function getProvider() {
    const accounts = await ethers.getSigners();
    return accounts[0].provider as Provider;
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});

