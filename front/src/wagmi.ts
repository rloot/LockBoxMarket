import { configureChains, createConfig } from 'wagmi'
import { mantleTestnet } from './chains/mantleTestnet'
import { goerli, mainnet } from 'wagmi/chains'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { publicProvider } from 'wagmi/providers/public'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mainnet, mantleTestnet, ...(import.meta.env?.MODE === 'development' ? [goerli] : [])],
  [
    publicProvider(),
  ],
)

export const config = createConfig({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
  ],
  publicClient,
  webSocketPublicClient,
})
