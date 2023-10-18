import * as React from 'react'
import * as ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiConfig } from 'wagmi'

import { App } from './App'
import { config } from './wagmi'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiConfig config={config}>
        <App />
      </WagmiConfig>
    </QueryClientProvider>
  </React.StrictMode>,
)
