import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { generateSecretKey, getPwdHash, getUserId } from '../../utils/user';
import { aesEncrypt, getAesIV, getAesKey } from '../../utils/AES';
import { StorageKeys } from '../../constants/keys';
import { useLocalStorageState } from 'ahooks';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { DeVaultFactoryAbi } from '../../abi/DeVaultFactoryAbi';
import { useVault } from '../../hooks/useVault';
import IPFSClient from '../../utils/IPFS';

export default function SetupDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [reenter, setReenter] = useState('');
  const [userId, setUserId] = useState('');
  const [pwdHass, setPwdHash] = useState('');
  const { init } = useVault();

  const [initialized, setInitialized] = useLocalStorageState(StorageKeys.vaultSetupFinished, {
    defaultValue: false,
  });

  const { config: factoryContractConfig } = usePrepareContractWrite({
    address: '0x21569c8c917406fE705dDb1664523D2AF67A73a3',
    abi: DeVaultFactoryAbi,
    functionName: 'createDeVault',
    args: [userId, pwdHass],
  });

  const { writeAsync: factoryContractWrite } = useContractWrite(factoryContractConfig);

  async function onSubmit() {
    if (!email || !masterPassword || !reenter) return;
    if (masterPassword !== reenter) return;
    setInitialized(true);

    const secretKey = generateSecretKey();
    window.localStorage.setItem(StorageKeys.getSecretKey(masterPassword), secretKey);
    window.localStorage.setItem(StorageKeys.emailKey, email);

    setUserId(getUserId(email, secretKey));
    setPwdHash(getUserId(email, secretKey));
    const aesKey = getAesKey(email, masterPassword, secretKey);
    const aesIV = getAesIV(masterPassword, secretKey);
    const vaultText = `email|${email}|${email}`;
    const encryptedVault = aesEncrypt(vaultText, aesKey, aesIV);
    console.log(encryptedVault);

    init(email, vaultText);
    window.localStorage.setItem(StorageKeys.getVaultKey(masterPassword, secretKey), encryptedVault);
    factoryContractWrite?.().then((data) => {
      data
        .wait()
        .then((res) => {
          let contract = res.logs[0].topics[2];
          window.localStorage.setItem('contractAddress', contract);
          IPFSClient.uploadFile('').then((cid) => {
            // TODO: background.js
            // TODO: contract
            setIsOpen(false);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => setIsOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-[80%] transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                  Setup New Vault
                </Dialog.Title>

                <div className="mt-2">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Your email</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@devault.io"
                      className="input w-full input-sm"
                    />
                    <label className="label mt-2">
                      <span className="label-text">Master Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={masterPassword}
                      onChange={(e) => setMasterPassword(e.target.value)}
                      className="input w-full input-sm"
                    />
                    <label className="label mt-2">
                      <span className="label-text">Re-enter Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={reenter}
                      onChange={(e) => setReenter(e.target.value)}
                      className="input w-full input-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <button type="button" className="btn w-full " onClick={onSubmit}>
                    Submit
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
