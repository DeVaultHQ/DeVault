import { useState } from 'react';
import { useVault } from '../hooks/useVault';
import AddRecordDialog from './dialog/AddRecordDialog';

export default function VaultList() {
  const { passwordList } = useVault();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full h-full flex relative min-h-screen text-white">
      <div className="basis-1/4">
        {passwordList?.map((e) => (
          <p>{e.uname}</p>
        ))}
      </div>
      <div className="basis-3/4"></div>
      <div className="absolute top-[-80px] left-1">
        <button className="btn" onClick={() => setIsOpen(true)}>
          Add Record
        </button>
        {passwordList?.length}
      </div>
      <AddRecordDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
