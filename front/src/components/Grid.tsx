
import Stack from '@mui/material/Stack'

import { GridCard } from "./GridCard"

export const Grid = ({ NFTs }) => {

  return (
    <>
      <Stack direction="row" spacing={4} useFlexGap flexWrap="wrap">
        {NFTs && NFTs.map(nft =>{
          return (
          <GridCard
            key={nft.cid}
            cid={nft.cid}
            tokenId={nft.token_id}
            tokenContract={nft.contract_address}
          />
          )
        })}
      </Stack>
    </>
  )
};