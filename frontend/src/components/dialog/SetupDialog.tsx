import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState } from 'react';
import {
  generateSecretKey,
  getDataHash,
  getProof,
  getPwdHash,
  getUserId,
  stringToHex,
} from '../../utils/user';
import { aesEncrypt, getAesIV, getAesKey } from '../../utils/AES';
import { StorageKeys } from '../../constants/keys';
import { useLocalStorageState } from 'ahooks';
import { useContractWrite, usePrepareContractWrite, useProvider, useSigner } from 'wagmi';
import { DeVaultFactoryAbi } from '../../abi/DeVaultFactoryAbi';
import { useVault } from '../../hooks/useVault';
import { AAContractAbi } from '../../abi/AAContractAbi';
import { hash } from '../../utils/hash';
import { BigNumber, ethers } from 'ethers';
// import IPFSClient from '../../utils/IPFS';

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
  const { init } = useVault();

  const provider = useProvider();
  const signer = useSigner();

  const [initialized, setInitialized] = useLocalStorageState(StorageKeys.vaultSetupFinished, {
    defaultValue: false,
  });

  async function onSubmit() {
    if (!email || !masterPassword || !reenter) return;
    if (masterPassword !== reenter) return;
    setInitialized(true);

    const factoryContract = new ethers.Contract(
      '0x8ede80F98290383A39695809B5413A8D28783B40',
      DeVaultFactoryAbi,
      provider
    );

    const secretKey = generateSecretKey();
    const vaultKey = hash('1');
    const vaultValue = 'fdfdfdfdfdf';
    const userId = BigNumber.from(getUserId(email, secretKey)).toString();

    window.localStorage.setItem(StorageKeys.getSecretKey(masterPassword), secretKey);
    window.localStorage.setItem(StorageKeys.emailKey, email);
    let passwordHash = await getProof(
      provider,
      masterPassword,
      userId,
      '0',
      getDataHash(vaultKey, vaultValue)
    );
    const pwdHass = passwordHash.pwdhash;
    const aesKey = getAesKey(email, masterPassword, secretKey);
    const aesIV = getAesIV(masterPassword, secretKey);
    const vaultText = `email|${email}|${email}\n`;
    const encryptedVault = aesEncrypt(vaultText, aesKey, aesIV);

    init(email, vaultText);
    window.localStorage.setItem(StorageKeys.getVaultKey(masterPassword, secretKey), encryptedVault);
    
    let factoryContractSigner = factoryContract.connect(signer.data as ethers.Signer);
    let factoryContractTransaction = await factoryContractSigner.createDeVault(userId, pwdHass);
    let res = await factoryContractTransaction.wait();
    let contract = BigNumber.from(res.logs[0].topics[2]).toHexString();
    window.localStorage.setItem('contractAddress', contract);
    const tokenContract = new ethers.Contract(contract, AAContractAbi, provider);
    let nonce: BigNumber = await tokenContract.getNonce();
    let proof = await getProof(
      provider,
      masterPassword,
      userId,
      nonce.toString(),
      getDataHash(vaultKey, vaultValue)
    );

    let txSigner = tokenContract.connect(signer.data as ethers.Signer);
    let transaction = await txSigner.setVault(
      vaultKey,
      vaultValue,
      proof.proof,
      proof.expiration,
      proof.allhash
    );
    await transaction.wait();
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
