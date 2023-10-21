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

import marketAbi from '../../../out/Market.sol/Market.json'
import {addressesByChain } from "../globals";

export default function OnSaleTab() {
  const [textFieldValue, setTextFieldValue] = useState('');
  const { chain } = useNetwork()

  const { data: saleData } = useContractRead({
    address: addressesByChain[chain?.id].MARKET,
    abi: marketAbi.abi,
    functionName: 'listings',
    args: [ textFieldValue ],
    enabled: isAddress(textFieldValue)
  });

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
  )
};