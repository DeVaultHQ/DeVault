import logo from '../logo.svg';
import { useState } from 'react';

export default function Lock({ setUnlock }: { setUnlock: () => void }) {
  const [pass, setPass] = useState('');

  function validate() {
    setUnlock();
  }

  return (
    <div className="w-full h-full flex flex-col items-center">
      <img src={logo} className="App-logo" alt="logo" />

      <div className="flex gap-2">
        <input
          type="password"
          value={pass}
          placeholder="master password"
          className="input text-gray-900"
          onChange={(e) => setPass(e.target.value)}
        ></input>

        <button className="btn" onClick={validate}>
          Unlock
        </button>
      </div>
    </div>
  );
}
