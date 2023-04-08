import { useEffect, useState } from 'react';
import { useVault } from '../hooks/useVault';
import AddRecordDialog from './dialog/AddRecordDialog';
import { useProvider } from 'wagmi';
import { BigNumber } from 'ethers';

export default function VaultList() {
  const { passwordList } = useVault();
  const [isOpen, setIsOpen] = useState(false);

  const [balance, setBalance] = useState(0);
  const provider = useProvider();

  useEffect(() => {
    async function fetch() {
      const value = await provider.getBalance('0xbde121b7c6df4034765c0a544a31fc4aa6f48dc5');
      setBalance(Number(BigNumber.from(value).toString()));
    }
    fetch();
  }, [provider]);

  return (
    <div>
      <div className="min-h-[120px] text-4xl text-white font-bold m-auto flex items-center justify-center">
        {balance.toFixed(2)} ETH
      </div>
      <div className="mx-4">
        <button className="btn btn-block" onClick={() => setIsOpen(true)}>
          Add Record
        </button>
      </div>
      <div className="menu h-full flex flex-col gap-3 relative m-4 rounded-box min-h-[calc(80vh_-_100px)]">
        {passwordList?.map((e, index) => (
          <Item key={index} domain={e.domain} uname={e.uname} pass={e.pwd} />
        ))}

        <AddRecordDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}

function Item(e: { domain: string; uname: string; pass: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="h-20 text-white p-4 flex items-center cursor-pointer bg-primary/20 rounded-xl"
      onClick={() => {
        navigator.clipboard.writeText(e.pass);
      }}
    >
      <div className="grow text-left">
        <p className="text-lg">{e.domain}</p>
        <p>{e.uname}</p>
      </div>
      <div
        className="cursor-pointer min-w-[120px] text-right"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        {isOpen ? <p>{e.pass}</p> : <p>******</p>}
      </div>
    </div>
  );
}
