import { v4 as uuidv4 } from 'uuid';
import { hash } from './hash';

export function generateSecretKey() {
  return uuidv4();
}

export function getUserId(address: string, secretKey: string) {
  return hash(address + secretKey);
}
