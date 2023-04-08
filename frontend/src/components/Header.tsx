import { useState, useEffect } from 'react';
import { useContractRead, useDisconnect } from 'wagmi';
import { StorageKeys } from '../constants/keys';

export default function Header({
  isConnected,
  setLocked,
}: {
  isConnected: boolean;
  setLocked: (e: boolean) => void;
}) {
  const [aaAddr, setAaAddr] = useState('');
  const [email, setEmail] = useState('');
  const { disconnectAsync } = useDisconnect();

  useEffect(() => {
    setAaAddr(window.localStorage.getItem(StorageKeys.contractAddrKey) ?? '');
    setEmail(window.localStorage.getItem(StorageKeys.emailKey) ?? '');
  }, []);

  return (
    <header className="h-20">
      {isConnected && (
        <div className="flex w-full py-2 px-4 items-center">
          <div className="flex items-center grow">
            <img alt="" src="img/logo.svg" width={64} height={64} />
            <div className="text-white text-left">
              <p className="text-bold">{email}</p>
              <p className="text-xs text-slate-200">
                {aaAddr?.substring(0, 5) + '..' + aaAddr?.substring(38)}
              </p>
            </div>
          </div>

          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="w-10 h-10 text-slate-200 btn p-0 btn-circle btn-sm">
              <img alt="" src="img/ic-setting.svg" width={16} height={16} className="text-white" />
            </label>

            <ul
              tabIndex={0}
              className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li>
                <div onClick={() => disconnectAsync()}>Disconnect</div>
              </li>
              <li>
                <div onClick={() => setLocked(true)}> Lock</div>
              </li>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
