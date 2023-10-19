import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useGetCIDData = (cid) => {

  const AXIOS_CONFIG = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  const requestUrl = `https://chargedparticles.infura-ipfs.io/ipfs/${cid}`

  return useQuery({
    queryKey: ['NFTMetadata', cid],
    queryFn: async () => await axios.get(requestUrl, AXIOS_CONFIG),
    select: (response) => {
      const data = response?.data

      return {
        name: data?.name,
        description: data?.description,
        image: `https://chargedparticles.infura-ipfs.io/ipfs/${data?.image}`
      }
    }
  });
}

