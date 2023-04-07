import { v4 as uuidv4 } from 'uuid';
import { hash } from './hash';
import { BigNumber } from 'ethers';
const snarkjs = require("snarkjs");

export function generateSecretKey() {
  return uuidv4();
}

export function getUserId(email: string, secretKey: string) {
  return hash(email + secretKey);
}

export async function getPwdHash(pwd: string) {
  let input = [stringToHex(pwd)]
  let data = await snarkjs.groth16.fullProve({in:input}, "/zk/circuit.wasm", "/zk/circuit_final.zkey")
  return data.publicSignals[0]
}

function stringToHex(string: string) :string{
  let hexStr = '';
  for (let i = 0; i < string.length; i++) {
      let compact = string.charCodeAt(i).toString(16)
      hexStr += compact
  }
  return '0x' + hexStr
}

function b(num: string):BigNumber {
  return BigNumber.from(num)
}

function s(bn: BigNumber) {
  return bn.toString()
}
