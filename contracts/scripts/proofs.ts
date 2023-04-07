import {Provider} from "@ethersproject/providers";
import {BigNumber, utils} from "ethers";
const snarkjs = require("snarkjs");
const fs = require("fs");

export async function getProof(
    provider: Provider,
    pwd: string,
    key: string,
    nonce: string,
    datahash: string) {

    let expiration = parseInt(String(Date.now() / 1000 + 600))
    let chainId = (await provider.getNetwork()).chainId
    console.log("ChainId", chainId)
    let fullhash = utils.solidityKeccak256(['uint256','uint256','uint256','uint256'], [expiration, chainId, nonce, datahash])
    fullhash = s(b(fullhash).div(8)) //must be 254b, not 256b

    let input = [stringToHex(pwd), s(b(key)), fullhash]
    let data = await snarkjs.groth16.fullProve({in:input}, "./zk/v1/circuit_js/circuit.wasm", "./zk/v1/circuit_final.zkey")

    // console.log(JSON.stringify(data))

    const vKey = JSON.parse(fs.readFileSync("./zk/v1/verification_key.json"))
    const res = await snarkjs.groth16.verify(vKey, data.publicSignals, data.proof)

    if (res === true) {
        console.log("Verification OK")

        let pwdhash = data.publicSignals[0]
        let fullhash = data.publicSignals[1]
        let allhash = data.publicSignals[2]

        let proof = [
            BigNumber.from(data.proof.pi_a[0]).toHexString(),
            BigNumber.from(data.proof.pi_a[1]).toHexString(),
            BigNumber.from(data.proof.pi_b[0][1]).toHexString(),
            BigNumber.from(data.proof.pi_b[0][0]).toHexString(),
            BigNumber.from(data.proof.pi_b[1][1]).toHexString(),
            BigNumber.from(data.proof.pi_b[1][0]).toHexString(),
            BigNumber.from(data.proof.pi_c[0]).toHexString(),
            BigNumber.from(data.proof.pi_c[1]).toHexString()
        ]
        return {proof, pwdhash, key, expiration, chainId, nonce, datahash, fullhash, allhash}
    } else {
        throw new Error("Verification failed");
    }
}


function stringToHex(string: string) :string{
    let hexStr = '';
    for (let i = 0; i < string.length; i++) {
        let compact = string.charCodeAt(i).toString(16)
        hexStr += compact
    }
    return '0x' + hexStr
}

export function m(num: number, decimals: BigNumber): BigNumber {
    return BigNumber.from(num).mul(BigNumber.from(10).pow(decimals))
}

export function d(bn: BigNumber, decimals: BigNumber): Number {
    return bn.mul(BigNumber.from(100)).div(BigNumber.from(10).pow(decimals)).toNumber() / 100
}

export function b(num: string):BigNumber {
    return BigNumber.from(num)
}

export function n(bn: BigNumber) {
    return bn.toNumber()
}

export function s(bn: BigNumber) {
    return bn.toString()
}
