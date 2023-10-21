import { useState } from "react";
import {
  useContractRead,
  useNetwork,
  useContractWrite,
} from "wagmi"

import { isAddress } from 'viem'

import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import marketAbi from '../../../out/Market.sol/Market.json'
import SimpleAccountABI from '../../../out/Account.sol/SimpleAccount.json'
import {addressesByChain } from "../globals";

export default function OnSaleTab() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const { chain } = useNetwork()

  const { data: saleData, isSuccess: isSaleDataSuccess } = useContractRead({
    address: addressesByChain[chain?.id].MARKET,
    abi: marketAbi.abi,
    functionName: 'listings',
    args: [ textFieldValue ],
    enabled: isAddress(textFieldValue)
  });

  const { data: tokenData, isSuccess: isTokenDataSuccess } = useContractRead({
    address: textFieldValue,
    abi: SimpleAccountABI.abi,
    functionName: 'token',
    enabled: isAddress(textFieldValue)
  });

  const { data: locked } = useContractRead({
    address: textFieldValue,
    abi: SimpleAccountABI.abi,
    functionName: 'locked',
    enabled: isAddress(textFieldValue)
  });

  console.log(locked)

  const { data, isLoading, isSuccess, write: buy } = useContractWrite({
    address: addressesByChain[chain?.id].MARKET,
    abi: marketAbi.abi,
    functionName: 'buy',
    args: [ textFieldValue ],
    value: 1n,
  })

  const handleTextFieldChange = (event) => {
    setTextFieldValue(event.target.value);
  };

  return (
    <Stack direction="row">
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '25vw' },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="outlined-basic"
          label="TBA Address"
          variant="outlined"
          value={textFieldValue}
          onChange={handleTextFieldChange}
        />
        <Box>
          <Button variant="contained" size="large" onClick={() => buy}> BUY </Button>
        </Box>
      </Box>
      <Box mt={2}>
        {locked && (<Chip label="Locked" variant="outlined" />)}
      </Box>
    </Stack>
  )
};