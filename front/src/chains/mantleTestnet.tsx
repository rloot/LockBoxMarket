import { Chain } from '@wagmi/core'
 
export const mantleTestnet = {
  id: 5001,
  name: 'Mantle Testnet',
  network: 'Mantle Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'MNT',
    symbol: 'MNT',
  },
  rpcUrls: {
    public: { http: ['https://rpc.ankr.com/mantle_testnet'] },
    default: { http: ['https://rpc.ankr.com/mantle_testnet'] },
  },
  blockExplorers: {
    default: { name: 'Mantle explorer', url: 'https://explorer.testnet.mantle.xyz' },
  },
  contracts: {
  },
} as const satisfies Chain