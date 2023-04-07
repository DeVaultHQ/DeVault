import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { plaintextState, vaultState } from '../store/store';
import { aesDecrypt, aesEncrypt } from '../utils/AES';

export function useVault() {
  const [vault, setVault] = useRecoilState(vaultState);
  const [plaintext, setPlainText] = useRecoilState(plaintextState);
  const [email, setEmail] = useState('');

  function init(email: string, plaintext: string) {
    setEmail(email);
    setPlainText(plaintext);
  }

  const passwordMap = useMemo(() => {
    const items = plaintext.split('\n');
    const _passwords: Map<string, [{ uname: string; pwd: string; index: number }]> = new Map();

    if (items.length) {
      for (let i = 0; i < items.length; i++) {
        if (!items[i]) {
          continue;
        }
        const [domain, username, password] = items[i].split('|');
        if (domain === 'email') {
          continue;
        }
        if (domain && username && password) {
          if (_passwords.has(domain)) {
            _passwords.get(domain)?.push({
              uname: aesDecrypt(username, email, ''),
              pwd: password,
              index: i,
            });
          } else {
            _passwords.set(domain, [
              {
                uname: aesDecrypt(username, email, ''),
                pwd: password,
                index: i,
              },
            ]);
          }
        }
      }
    }
    return _passwords;
  }, [email, plaintext]);

  const passwordList = useMemo(() => {
    const passwords: { uname: string; pwd: string; domain: string; index: number }[] = [];
    passwordMap.forEach((value, key) => {
      const list = value.map((e) => ({
        ...e,
        domain: key,
      }));
      passwords.push(...list);
    });
    console.log('passworkds', passwords);
    return passwords;
  }, [passwordMap, plaintext]);

  function addPassword(domain: string, username: string, password: string) {
    const text = plaintext + `\n${domain}|${aesEncrypt(username, email, '')}|${password}`;
    setPlainText(text);
  }

  return { vault, setVault, passwordList, init, addPassword };
}
