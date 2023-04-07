import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import { generateSecretKey, getUserId } from '../../utils/user';
import { aesEncrypt, getAesIV, getAesKey } from '../../utils/AES';
import { StorageKeys } from '../../constants/keys';
import { useLocalStorageState } from 'ahooks';

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

  const [initialized, setInitialized] = useLocalStorageState(StorageKeys.vaultSetupFinished, {
    defaultValue: false,
  });

  function onSubmit() {
    if (!email || !masterPassword || !reenter) return;
    if (masterPassword !== reenter) return;
    setInitialized(true);

    const secretKey = generateSecretKey();
    window.localStorage.setItem(StorageKeys.getSecretKey(masterPassword), secretKey);

    const transferPass = getUserId(email, secretKey);
    const aesKey = getAesKey(email, masterPassword, secretKey);
    const aesIV = getAesIV(masterPassword, secretKey);
    const encryptedVault = aesEncrypt('', aesKey, aesIV);
    console.log(encryptedVault);
    window.localStorage.setItem(StorageKeys.getVaultKey(masterPassword, secretKey), encryptedVault);

    // TODO: background.js
    // TODO: contract
    setIsOpen(false);
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
