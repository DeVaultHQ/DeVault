import { ethers } from 'ethers';

export function hash(input: string) {
  return ethers.utils.id(input);
}

export function secureHash(input: string) {
  return hash(hash(input));
}
