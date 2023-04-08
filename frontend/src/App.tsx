import { useLocalStorageState } from 'ahooks';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import './App.css';
import Lock from './components/Lock';
import Setup from './components/Setup';
import VaultList from './components/VaultList';
import { StorageKeys } from './constants/keys';
import { useEffect, useState } from 'react';
import Header from './components/Header';

function App() {
  const { connectAsync, connectors } = useConnect();
  const { isConnected } = useAccount();
  const [locked, setLocked] = useState(true);
  const [initialized] = useLocalStorageState(StorageKeys.vaultSetupFinished, {
    defaultValue: false,
  });

  return (
    <div className="App relative flex flex-col">
      <Header isConnected={isConnected} setLocked={setLocked} />
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
