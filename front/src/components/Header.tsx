import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { Button } from '@mui/material';

export default function Header() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const { connector, isConnected, address } = useAccount()
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect()

  const { disconnect } = useDisconnect();

  const handleConnect = (event) => {
    if(!isConnected) {
      connect({ connector: connectors[0]})
    } else {
      disconnect()
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const getShortAddress = (address, prefixLength = 7, suffixLength = 4) => {
    if (address.length < prefixLength + suffixLength) {
        return address; // Return the full address if it's too short
    }

    const prefix = address.slice(0, prefixLength);
    const suffix = address.slice(-suffixLength);

    return `${prefix}...${suffix}`;
}

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <RocketLaunchIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Market
          </Typography>
          <div>
            <Button variant="contained" onClick={handleConnect}>
              {isConnected ? getShortAddress(address) : 'Sign in'}
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
