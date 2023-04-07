import { useLocalStorageState } from 'ahooks';
import { useAccount, useConnect, useDisconnect } from 'wagmi';
import './App.css';
import Lock from './components/Lock';
import Setup from './components/Setup';
import { StorageKeys } from './constants/keys';

function App() {
  const { connectAsync, connectors } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();
  const [locked, setLocked] = useLocalStorageState('vault_locked', { defaultValue: true });

  const [initialized] = useLocalStorageState(StorageKeys.vaultSetupFinished, {
    defaultValue: false,
  });

  return (
    <div className="App relative">
      <header className="App-header">
        {!initialized && <Setup />}
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
      {isConnected && (
        <div className="absolute top-2 right-2 flex items-center gap-2">
          <p className="text-white">{address?.substring(0, 5) + '..' + address?.substring(38)}</p>
          <button className="btn btn-sm" onClick={() => disconnectAsync()}>
            Disconnect
          </button>
          <button className="btn btn-sm" onClick={() => setLocked(true)}>
            Lock
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
