import { useAccount } from 'wagmi'
import Container from '@mui/material/Container'

import { NetworkSwitcher } from './components/boilerplate/NetworkSwitcher'
import Header from './components/header'
import MarketTabs from './components/MarketTabs'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <Header />
      {isConnected && (
        <Container>
          <hr />
          <h2>Network</h2>
          <NetworkSwitcher />
          <br />
          <MarketTabs />
        </ Container>
      )}
    </>
  )
}
