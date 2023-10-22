import { useNetwork, useSwitchNetwork } from 'wagmi'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

export function NetworkSwitcher() {
  const { chain } = useNetwork()
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork()

  return (
    <Box m={2}>
      <Typography variant="h4">Network</Typography>
      <Typography variant='h6'>
        Connected to {chain?.name ?? chain?.id}
        {chain?.unsupported && ' (unsupported)'}
      </Typography>
      <br />
      {switchNetwork && (
        <>
          {chains.map((x) =>
            x.id === chain?.id ? null : (
              <Box mt={1} display="inline"> 
                <Button variant="outlined" size="small" key={x.id} onClick={() => switchNetwork(x.id)}>
                  Connect {x.name}
                  {isLoading && x.id === pendingChainId && ' (switching)'}
                </Button>
              </Box>
            ),
          )}
        </>
      )}

      <div>{error?.message}</div>
    </Box>
  )
}
