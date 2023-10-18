import { useQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import { getNftsCovalent } from "../utils/covalent";

export const useGetMyNFTs = () => {
  const { address } = useAccount()

  return useQuery({
    queryKey: ['myNFTs', address],
    queryFn: async () => getNftsCovalent(address ?? '', 5001),
    select: (response) => response?.data?.data?.items
  });
}

