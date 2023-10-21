import {
  useContractRead,
  useNetwork,
  useContractWrite,
} from "wagmi"

import marketAbi from '../../../out/Market.sol/Market.json'
import {addressesByChain } from "../globals";
import { Button } from "@mui/material";

export default function OnSaleTab() {
  const { chain } = useNetwork()

  const { data: saleData } = useContractRead({
    address: addressesByChain[chain?.id].MARKET,
    abi: marketAbi.abi,
    functionName: 'listings',
    args: ['0x3cEf61cc7aCD4e8a8532252C8A51cd4137C5c379']
  });

  const { data, isLoading, isSuccess, write: buy } = useContractWrite({
    address: addressesByChain[chain?.id].MARKET,
    abi: marketAbi.abi,
    functionName: 'buy',
    args: ['0x3cEf61cc7aCD4e8a8532252C8A51cd4137C5c379'],
    value: 1n,
  })

  console.log(saleData)
  return (
    <>
      <Button onClick={() => buy}> BUY </Button>
    </>
  )
};