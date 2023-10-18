import { useAccount } from "wagmi";
import { useEffect } from "react";
import { getNftsCovalent } from "../utils/covalent";
import { useGetMyNFTs } from "../hooks/useGetMyNFTs";

const Card = () => {

};

export default function MyNFTsTab () {
  // const { address } = useAccount()
  const { data, isLoading } = useGetMyNFTs();

  console.log(data, isLoading);

  return (<>HEY !</>)

};