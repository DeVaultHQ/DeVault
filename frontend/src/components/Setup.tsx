import { useState } from 'react';
import logo from '../logo.svg';
import RecoverDialog from './dialog/RecoverDialog';
import SetupDialog from './dialog/SetupDialog';

export default function Setup() {
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isRecoverOpen, setIsRecoverOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center relative">
      <SetupDialog isOpen={isSetupOpen} setIsOpen={setIsSetupOpen} />
      <RecoverDialog isOpen={isRecoverOpen} setIsOpen={setIsRecoverOpen} />
      <img src={logo} className="App-logo" alt="logo" />

      <p className="text-xl font-medium text-white">Welcome to DeVault</p>
      <div className="flex gap-2 mt-2">
        <button className="btn btn-md" onClick={() => setIsSetupOpen(true)}>
          Setup New Vault
        </button>
        <button className="btn" onClick={() => setIsRecoverOpen(true)}>
          Recover Your Vault
        </button>
      </div>
    </div>
  );
}
