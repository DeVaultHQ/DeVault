import { Dialog, Transition } from '@headlessui/react';
import { BigNumber, ethers } from 'ethers';
import { Fragment, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { useProvider, useSigner } from 'wagmi';
import { AAContractAbi } from '../../abi/AAContractAbi';
import { StorageKeys } from '../../constants/keys';
import { useVault } from '../../hooks/useVault';
import { masterPasswordState } from '../../store/store';
import { aesEncryptVault } from '../../utils/AES';
import IPFSClient from '../../utils/IPFS';
import { hash } from '../../utils/hash';
import { getDataHash, getProof, getUserId } from '../../utils/user';

export default function AddRecordDialog({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
}) {
  const [domain, setDomain] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const masterPassword = useRecoilValue(masterPasswordState);
  const { addPassword } = useVault();
  const [loading, setIsLoading] = useState(false);

  const provider = useProvider();
  const signer = useSigner();

  async function onSubmit() {
    try {
      setIsLoading(true);
      const aaAddr = window.localStorage.getItem(StorageKeys.contractAddrKey) || '';
      const secretKey = window.localStorage.getItem(StorageKeys.getSecretKey(masterPassword)) || '';
      const email = window.localStorage.getItem(StorageKeys.emailKey) || '';

      // Upload
      const plainText = addPassword(domain, username, password);
      const encrypted = aesEncryptVault(email, masterPassword, secretKey, plainText);
      const fileCid = await IPFSClient.uploadFile(encrypted);

      const userId = BigNumber.from(getUserId(email, secretKey)).toString();
      const vaultKey = hash('1');

      const aaContract = new ethers.Contract(aaAddr, AAContractAbi, provider);
      let nonce: BigNumber = await aaContract.getNonce();

      let proof = await getProof(
        provider,
        masterPassword,
        userId,
        nonce.toString(),
        getDataHash(vaultKey, fileCid)
      );

      let txSigner = aaContract.connect(signer.data as ethers.Signer);
      let transaction = await txSigner.setVault(
        vaultKey,
        fileCid,
        proof.proof,
        proof.expiration,
        proof.allhash
      );
      await transaction.wait();

      window.localStorage.setItem(StorageKeys.getVaultKey(masterPassword, secretKey), encrypted);

      setIsLoading(false);
      setDomain('');
      setUsername('');
      setPassword('');
      setIsOpen(false);
    } catch (error) {
      console.error(error);
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
                  Add Record
                </Dialog.Title>

                <div className="mt-2">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Domain</span>
                    </label>
                    <input
                      type="text"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      placeholder="example.com"
                      className="input w-full input-sm"
                    />
                    <label className="label mt-2">
                      <span className="label-text">Username</span>
                    </label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="example@devault.io"
                      className="input w-full input-sm"
                    />
                    <label className="label mt-2">
                      <span className="label-text"> Password</span>
                    </label>
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input w-full input-sm"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  {loading ? (
                    <button type="button" className="btn w-full btn-disabled">
                      Tx Processing
                    </button>
                  ) : (
                    <button type="button" className="btn w-full " onClick={onSubmit}>
                      Submit
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
