export const AAContractAbi = [
  {
    type: 'constructor',
    stateMutability: 'nonpayable',
    inputs: [
      { type: 'uint256', name: 'keyHash', internalType: 'uint256' },
      { type: 'uint256', name: 'passwordHash', internalType: 'uint256' },
    ],
  },
  {
    type: 'event',
    name: 'SetVault',
    inputs: [
      { type: 'uint256', name: 'key', internalType: 'uint256', indexed: true },
      { type: 'string', name: 'value', internalType: 'string', indexed: false },
      { type: 'uint256', name: 'nonce', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'UpdatePasswordHash',
    inputs: [
      { type: 'uint256', name: 'oldPasswordHash', internalType: 'uint256', indexed: false },
      { type: 'uint256', name: 'newPasswordHash', internalType: 'uint256', indexed: false },
      { type: 'uint256', name: 'nonce', internalType: 'uint256', indexed: false },
    ],
    anonymous: false,
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'getKeyHash',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'getNonce',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'uint256', name: '', internalType: 'uint256' }],
    name: 'getPasswordHash',
    inputs: [],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'string', name: '', internalType: 'string' }],
    name: 'getVault',
    inputs: [{ type: 'uint256', name: 'vaultKeyHash', internalType: 'uint256' }],
  },
  {
    type: 'function',
    stateMutability: 'nonpayable',
    outputs: [],
    name: 'setVault',
    inputs: [
      { type: 'uint256', name: 'vaultKeyHash', internalType: 'uint256' },
      { type: 'string', name: 'vaultValue', internalType: 'string' },
      { type: 'uint256[8]', name: 'proofs', internalType: 'uint256[8]' },
      { type: 'uint256', name: 'expiration', internalType: 'uint256' },
      { type: 'uint256', name: 'allHash', internalType: 'uint256' },
    ],
  },
  {
    type: 'function',
    stateMutability: 'view',
    outputs: [{ type: 'bool', name: '', internalType: 'bool' }],
    name: 'verifyProof',
    inputs: [
      { type: 'uint256[8]', name: 'proof', internalType: 'uint256[8]' },
      { type: 'uint256', name: 'pwdhash', internalType: 'uint256' },
      { type: 'uint256', name: 'fullhash', internalType: 'uint256' },
      { type: 'uint256', name: 'allhash', internalType: 'uint256' },
    ],
  },
];
