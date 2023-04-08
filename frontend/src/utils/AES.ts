import CryptoJS from 'crypto-js';
import { hash } from './hash';

function toWordArray(str: string) {
  return CryptoJS.enc.Utf8.parse(str);
}

function toString(words: CryptoJS.lib.WordArray) {
  return CryptoJS.enc.Utf8.stringify(words);
}

function toBase64String(words: CryptoJS.lib.WordArray) {
  return CryptoJS.enc.Base64.stringify(words);
}

export const aesEncrypt = (data: string, key: string, iv: string) => {
  const encrypted = CryptoJS.AES.encrypt(data, toWordArray(key), {
    mode: CryptoJS.mode.CTR,
    iv: toWordArray(iv),
    padding: CryptoJS.pad.NoPadding,
  });
  return toBase64String(encrypted.ciphertext);
};

export const aesDecrypt = (data: string, key: string, iv: string) => {
  const decrypted = CryptoJS.AES.decrypt(data, toWordArray(key), {
    mode: CryptoJS.mode.CTR,
    iv: toWordArray(iv),
    padding: CryptoJS.pad.NoPadding,
  });
  return toString(decrypted);
};

export function getAesKey(address: string, masterPassword: string, secretKey: string) {
  return hash(hash(address + masterPassword + secretKey));
}

export function getAesIV(masterPassword: string, secretKey: string) {
  return hash(masterPassword + secretKey).slice(0, 16);
}

export function aesEncryptVault(
  email: string,
  masterPassword: string,
  secretKey: string,
  text: string
) {
  const aesKey = getAesKey(email, masterPassword, secretKey);
  const aesIV = getAesIV(masterPassword, secretKey);
  const encryptedVault = aesEncrypt(text, aesKey, aesIV);
  return encryptedVault;
}
