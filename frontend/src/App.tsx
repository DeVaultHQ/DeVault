import { useLocalStorageState } from 'ahooks';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import './App.css';
import Lock from './components/Lock';
import Setup from './components/Setup';
import VaultList from './components/VaultList';
import { StorageKeys } from './constants/keys';
import { useState } from 'react';

function App() {
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [locked, setLocked] = useState(true);
  const [initialized] = useLocalStorageState(StorageKeys.vaultSetupFinished, {
    defaultValue: false,
  });

  return (
    <div className="App relative flex flex-col">
      <header className="h-20">
        {isConnected && (
          <div className="flex w-full py-2 px-4 items-center">
            <div className="flex items-center grow">
              <img alt="" src="img/logo.svg" width={40} height={40} />
              <p className="text-xs text-slate-200">
                {address?.substring(0, 5) + '..' + address?.substring(38)}
              </p>
            </div>

            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="w-10 h-10 text-slate-200 btn p-0 btn-circle btn-sm">
                <img
                  alt=""
                  src="img/ic-setting.svg"
                  width={16}
                  height={16}
                  className="text-white"
                />
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
      <header className="App-header">
        {isConnected && !initialized && <Setup />}
        {isConnected && locked && initialized && <Lock setUnlock={() => setLocked(false)} />}
        {!isConnected && (
          <button
            className="btn mt-10"
            onClick={() => {
              connectAsync({
                connector: connectors.find((e) => e.id === 'metaMask'),
              });
            }}
          >
            Connect Wallet
          </button>
        )}
      </header>
      {isConnected && !locked && initialized && <VaultList />}
    </div>
  );
}

export default App;
