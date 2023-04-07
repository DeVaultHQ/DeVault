import { initializeProvider } from '@metamask/providers';
import { getDefaultWallets } from '@rainbow-me/rainbowkit';
import PortStream from 'extension-port-stream';
import { configureChains, createClient } from 'wagmi';
import { goerli, mainnet, scrollTestnet } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

if (chrome.runtime?.connect) {
  const metamaskPort = chrome.runtime?.connect('nkbihfbeogaeaoehlefnkodbefgpgknn');
  const pluginStream = new PortStream(metamaskPort as any);
  initializeProvider({
    connectionStream: pluginStream as any,
    shouldSetOnWindow: true,
  });
}

const { chains, provider, webSocketProvider } = configureChains(
  [mainnet, goerli, scrollTestnet],
  [publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  chains,
});

export const client = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export { chains };
