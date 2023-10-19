import { useAccount } from 'wagmi'

import { Account } from './components/boilerplate/Account'
import { NetworkSwitcher } from './components/boilerplate/NetworkSwitcher'
import { Balance } from './components/boilerplate/Balance'
import Header from './components/header'
import MarketTabs from './components/MarketTabs'

export function App() {
  const { isConnected } = useAccount()

  return (
    <>
      <Header />
      {isConnected && (
        <>
          <hr />
          <h2>Network</h2>
          <NetworkSwitcher />
          <br />
          <hr />
          <MarketTabs />
        </>
      )}
    </>
  )
}
