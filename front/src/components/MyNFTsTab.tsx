import { useGetMyNFTs } from "../hooks/useGetMyNFTs";
import { Grid } from "./Grid";

export default function MyNFTsTab () {
  // const { address } = useAccount()
  const { data, isLoading } = useGetMyNFTs();

  return (
    <>
      <Grid />
    </>
  )

};