import { secureHash } from '../utils/hash';

export class StorageKeys {
  static vaultKey = 'vault_key';
  static secretKey = 'secret_key';
  static vaultSetupFinished = 'vault_setup_finished';

  static getVaultKey(masterPassword: string, secretKey: string) {
    return secureHash(StorageKeys.vaultKey + masterPassword + secretKey);
  }
  static getSecretKey(masterPassword: string) {
    return secureHash(StorageKeys.secretKey + masterPassword);
  }
}
