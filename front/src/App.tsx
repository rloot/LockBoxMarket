import { useAccount } from 'wagmi'
import Container from '@mui/material/Container'

import { NetworkSwitcher } from './components/boilerplate/NetworkSwitcher'
import MarketTabs from './components/MarketTabs'
import Header from './components/header'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <Header />
      {isConnected && (
        <Container>
          <h2>Network</h2>
          <NetworkSwitcher />
          <br />
          <MarketTabs />
        </ Container>
      )}
    </>
  )
}
