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
      const cidMetadata = response?.data

      console.log(cidMetadata)
      return {
        name: cidMetadata?.name,
        description: cidMetadata?.description,
        image: `https://chargedparticles.infura-ipfs.io/ipfs/${cidMetadata?.image}`,
        // address: data?.
      }
    }
  });
}

