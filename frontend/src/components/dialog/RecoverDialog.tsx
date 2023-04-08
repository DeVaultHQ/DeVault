import { Dialog, Transition } from '@headlessui/react';
import { BigNumber, ethers } from 'ethers';
import { Fragment, useEffect, useState } from 'react';
import { DeVaultFactoryAbi } from '../../abi/DeVaultFactoryAbi';
import { useProvider, useSigner } from 'wagmi';
import { getUserId } from '../../utils/user';
import { AAContractAbi } from '../../abi/AAContractAbi';
import IPFSClient from '../../utils/IPFS';
import { hash } from '../../utils/hash';
import { StorageKeys } from '../../constants/keys';
import { aesDecrypt, getAesIV, getAesKey } from '../../utils/AES';
import { useVault } from '../../hooks/useVault';
import { useLocalStorageState } from 'ahooks';

export default function RecoverDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const [email, setEmail] = useState('');
  const [masterPassword, setMasterPassword] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const [loading, setIsLoading] = useState(false);
  const [isRecoverSuccess, setIsRecoverSuccess] = useState(false);

  const provider = useProvider();
  const { init: initVault } = useVault();

  const [initialized, setInitialized] = useLocalStorageState(StorageKeys.vaultSetupFinished, {
    defaultValue: false,
  });

  useEffect(() => {
    setEmail('');
    setMasterPassword('');
    setSecretKey('');
    setIsLoading(false);
    setIsRecoverSuccess(false);
  }, [isOpen]);

  async function onsubmit() {
    if (!email || !masterPassword || !secretKey) return;
    setIsLoading(true);
    const vaultKey = hash('1');
    const factoryContract = new ethers.Contract(
      '0x8ede80F98290383A39695809B5413A8D28783B40',
      DeVaultFactoryAbi,
      provider
    );
    const userId = BigNumber.from(getUserId(email, secretKey)).toString();
    try {
      let devaultAddress = await factoryContract.getDeVault(userId);
      if (devaultAddress) {
        const aaContract = new ethers.Contract(devaultAddress, AAContractAbi, provider);
        let vaultVaule = await aaContract.getVault(vaultKey);
        if (vaultVaule) {
          let file: any = await IPFSClient.getFile(vaultVaule);
          if (file) {
            let text = await file.text();
            const aesKey = getAesKey(email, masterPassword, secretKey);
            const aesIV = getAesIV(masterPassword, secretKey);
            let plainText = aesDecrypt(text, aesKey, aesIV);
            initVault(plainText);
            window.localStorage.setItem(StorageKeys.getSecretKey(masterPassword), secretKey);
            window.localStorage.setItem(StorageKeys.emailKey, email);
            window.localStorage.setItem(StorageKeys.getVaultKey(masterPassword, secretKey), text);
            setIsRecoverSuccess(true);
            setInitialized(true);
          } else {
            throw new Error('file not exist');
          }
        } else {
          throw new Error('valut not exist');
        }
      } else {
        throw new Error('not exist');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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
                  Recover Your Vault
                </Dialog.Title>
                {isRecoverSuccess ? (
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-3xl mt-5">
                      Congratulations! Your vault has been recovered successfully.
                    </div>
                    <button
                      type="button"
                      className="btn w-full mt-16"
                      onClick={() => {
                        setIsOpen(false);
                      }}
                    >
                      OK
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="mt-2">
                      <div className="form-control w-full max-w-xs">
                        <label className="label">
                          <span className="label-text">Your email</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="example@devault.io"
                          className="input w-full max-w-xs input-sm"
                        />
                        <label className="label mt-2">
                          <span className="label-text">Master Password</span>
                        </label>
                        <input
                          type="password"
                          placeholder="Password"
                          value={masterPassword}
                          onChange={(e) => setMasterPassword(e.target.value)}
                          className="input w-full max-w-xs input-sm"
                        />
                        <label className="label mt-2">
                          <span className="label-text">Secret Key</span>
                        </label>

                        <input
                          type="password"
                          placeholder="Password"
                          value={secretKey}
                          onChange={(e) => setSecretKey(e.target.value)}
                          className="input w-full max-w-xs input-sm"
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      {loading ? (
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 btn-disabled"
                        >
                          loading
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                          onClick={() => onsubmit()}
                        >
                          Submit
                        </button>
                      )}
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
