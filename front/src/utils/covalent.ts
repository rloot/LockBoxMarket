import axios from 'axios';

const AXIOS_CONFIG = {
  auth: {
    username: import.meta.env?.VITE_COVALENT_API_KEY,
    password: '',
  },
  headers: {
    'Content-Type': 'application/json',
  },
};

const NETWORK_NAMES = {
  5000: 'mantle-mainnet',
  5001: 'mantle-testnet',
};

export const getNftsCovalent = async (address: string, chainId: number) => {
  const requestUrl =
    `https://api.covalenthq.com/v1/${NETWORK_NAMES[chainId]}/address/${address}/balances_nft/?no-spam=true&with-uncached=true`;
  return await axios.get(requestUrl, AXIOS_CONFIG);
}