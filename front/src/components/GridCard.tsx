import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useGetCIDData } from '../hooks/useGetCIDMetadata';

import { useContractRead } from 'wagmi'
import SimpleAccountABI from '../../../out/SimpleERC6551Account.sol/SimpleERC6551Account.json'
import RegisterABI from '../../../out/ERC6551Registry.sol/ERC6551Registry.json' 

export const GridCard = ({
  cid,
  tokenId,
  tokenContract,
  modalHandleOpen,
}) => {
  const { data: NFTData, isLoading } = useGetCIDData(cid)

  const accountRegisterParams = [ '0xEc3CdC2A15D4D058A3Ad37ecDbBc9c7b4c5Fb735', 5001, tokenContract, tokenId, 0 ]
  
  const { data: TBAAddress, isLoading: isTBAAccount } = useContractRead({
    address: '0x5EfE84aaade508741AcfA1853b4A732d0095F2E6',
    abi: RegisterABI.abi,
    functionName: 'account',
    args: accountRegisterParams
  })

  return (
    <>
    {!isLoading
      && (
        <Card sx={{ maxWidth: 300, minWidth: 200 }}>
          <CardMedia
            sx={{ height: 160 }}
            image={NFTData?.image}
            title="green iguana"
          />
          <CardContent>
            <Typography gutterBottom variant="h6" component="div">
             {NFTData?.name} 
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {NFTData?.description}
            </Typography>
          </CardContent>
          <CardActions>
            <Button onClick={modalHandleOpen} size="small">Sell</Button>
          </CardActions>
        </Card>
      )
    }
    </>
  );
};
