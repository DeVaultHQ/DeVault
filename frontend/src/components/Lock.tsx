import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { StorageKeys } from '../constants/keys';
import { useVault } from '../hooks/useVault';
import logo from '../logo.svg';
import { masterPasswordState } from '../store/store';
import { aesDecrypt, getAesIV, getAesKey } from '../utils/AES';
import Vault from '../utils/vault';

export default function Lock({ setUnlock }: { setUnlock: () => void }) {
  const [pass, setPass] = useState('');
  const { init } = useVault();
  const setMasterState = useSetRecoilState(masterPasswordState);

  function validate() {
    try {
      const secretKey = window.localStorage.getItem(StorageKeys.getSecretKey(pass));
      const email = window.localStorage.getItem(StorageKeys.emailKey) ?? '';
      if (!secretKey || !email) {
        return false;
      }
      const encryptedVault = window.localStorage.getItem(StorageKeys.getVaultKey(pass, secretKey));

      if (!encryptedVault?.trim()) {
        return false;
      }
      const aesKey = getAesKey(email, pass, secretKey);
      const aesIV = getAesIV(pass, secretKey);
      const plaintext = aesDecrypt(encryptedVault, aesKey, aesIV);
      if (!plaintext) {
        return false;
      }
      init(plaintext);
      setMasterState(pass);
      if (chrome.runtime) {
        const vault = new Vault();
        vault.build(plaintext);
        chrome.runtime.sendMessage(
          { type: 'setVault', vault: vault.getAllPasswords() },
          function (response) {}
        );
      }
    } catch (error) {
      console.error(error);
    }
    setUnlock();
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <img src={logo} className="App-logo" alt="logo" />

      <div className="flex gap-2">
        <input
          type="password"
          value={pass}
          placeholder="master password"
          className="input text-gray-900"
          onChange={(e) => setPass(e.target.value)}
        ></input>

        <button className="btn" onClick={validate}>
          Unlock
        </button>
      </div>
    </div>
  );
}
