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
