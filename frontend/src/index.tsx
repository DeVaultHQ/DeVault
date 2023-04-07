import React from 'react';
import ReactDOM from 'react-dom/client';
import { WagmiConfig } from 'wagmi';
import App from './App';
import './index.css';
import { chains, client } from './utils/wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
// import './polyfills';
import '@rainbow-me/rainbowkit/styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <App />
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
