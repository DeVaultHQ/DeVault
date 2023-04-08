import { useMemo, useState } from 'react';
import { useRecoilState } from 'recoil';
import { plaintextState, vaultState } from '../store/store';

export function useVault() {
  const [vault, setVault] = useRecoilState(vaultState);
  const [plaintext, setPlainText] = useRecoilState(plaintextState);

  function init(plaintext: string) {
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
              uname: username,
              pwd: password,
              index: i,
            });
          } else {
            _passwords.set(domain, [
              {
                uname: username,
                pwd: password,
                index: i,
              },
            ]);
          }
        }
      }
    }
    return _passwords;
  }, [plaintext]);

  const passwordList = useMemo(() => {
    const passwords: { uname: string; pwd: string; domain: string; index: number }[] = [];
    passwordMap.forEach((value, key) => {
      const list = value.map((e) => ({
        ...e,
        domain: key,
      }));
      passwords.push(...list);
    });
    return passwords;
  }, [passwordMap, plaintext]);

  function addPassword(domain: string, username: string, password: string) {
    const text = plaintext + `\n${domain}|${username}|${password}`;
    setPlainText(text);
  }

  return { vault, setVault, passwordList, init, addPassword };
}
