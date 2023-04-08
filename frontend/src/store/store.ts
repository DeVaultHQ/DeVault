import { atom } from 'recoil';
import Vault from '../utils/vault';

export const vaultState = atom<Vault | null>({
  key: 'vaultstate',
  default: null,
});

export const plaintextState = atom<string>({
  key: 'plaintextState',
  default: '',
});

export const masterPasswordState = atom<string>({
  key: 'masterPasswordState',
  default: '',
});
