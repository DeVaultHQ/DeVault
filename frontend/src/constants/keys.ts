import { secureHash } from '../utils/hash';

export class StorageKeys {
  static vaultKey = 'devault_vault_key';
  static secretKey = 'devault_secret_key';
  static emailKey = 'devault_email_key';
  static contractAddrKey = 'devault_contract_addr_key';
  static vaultSetupFinished = 'vault_setup_finished';

  static getVaultKey(masterPassword: string, secretKey: string) {
    return secureHash(StorageKeys.vaultKey + masterPassword + secretKey);
  }
  static getSecretKey(masterPassword: string) {
    return secureHash(StorageKeys.secretKey + masterPassword);
  }
}
