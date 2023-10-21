import { useAccount, useNetwork } from 'wagmi'
import Container from '@mui/material/Container'

import { NetworkSwitcher } from './components/boilerplate/NetworkSwitcher'
import MarketTabs from './components/MarketTabs'
import Header from './components/header'

export function App() {
  const { isConnected } = useAccount()
  const { chain } = useNetwork()

  return (
    <>
      <Header />
      {isConnected && (
        <Container>
          {chain?.unsupported ? (
            <NetworkSwitcher />
          ) : <MarketTabs />}
        </ Container>
      )}
    </>
  )
}
