export const DeVaultFactoryAbi = [
  { type: 'constructor', stateMutability: 'nonpayable', inputs: [] },
  {
    type: 'event',
    name: 'CreateDeVault',
    inputs: [
      { type: 'uint256', name: 'key', internalType: 'uint256', indexed: true },
      { type: 'address', name: 'devault', internalType: 'address', indexed: true },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [{ type: 'address', name: '', internalType: 'contract DeVault' }],
    name: 'createDeVault',
    inputs: [
      { type: 'uint256', name: 'keyHash', internalType: 'uint256' },
      { type: 'uint256', name: 'passwordHash', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'address', name: '', internalType: 'contract DeVault' }],
    name: 'getDeVault',
    inputs: [{ type: 'uint256', name: 'keyHash', internalType: 'uint256' }],
  },
];
