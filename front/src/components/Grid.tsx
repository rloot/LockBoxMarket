import { GridCard } from "./GridCard"

export const Grid = ({ NFTs }) => {
  console.log(NFTs);
  return (
    <>
      {NFTs && NFTs.map(nft =>{
        return <GridCard key={nft.cid} cid={nft.cid} />
      })}
    </>
  )
};
