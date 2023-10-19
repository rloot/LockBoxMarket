import { useGetMyNFTs } from "../hooks/useGetMyNFTs";
import { Grid } from "./Grid";

export default function MyNFTsTab () {
  const { data: myNFTs, isLoading } = useGetMyNFTs();


  const myNFTsParsed = !isLoading && myNFTs.reduce((carry, nft) => {
    let data = []
    nft?.nft_data.forEach(e => {
      data.push({
        'contract_address': nft.contract_address,
        'token_id':  e.token_id,
        'cid': e.token_url
      })
    })
    return [...data, ...carry ] ;
  }, [])

  return (
    <>
      <Grid NFTs={myNFTsParsed} />
    </>
  )

};