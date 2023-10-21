import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { useGetMyNFTs } from "../hooks/useGetMyNFTs";
import { Grid } from "./Grid";

export default function MyNFTsTab () {
  const { data: myNFTs, isLoading } = useGetMyNFTs();

  const myNFTsParsed = !isLoading && myNFTs.reduce((carry, nft) => {
    const flat = nft?.nft_data.map(e => {
      return {
        'contract_address': nft.contract_address,
        'token_id':  e.token_id,
        'cid': e.token_url
      }
    })
    return [...carry, ...flat ] ;
  }, [])

  return (
    <>
      {isLoading
        ? <Box textAlign="center" mt={5}><CircularProgress /></Box>
          : <Grid NFTs={myNFTsParsed} />
      }
    </>
  )

};