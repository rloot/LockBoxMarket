import { useState } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { useGetCIDData } from '../hooks/useGetCIDMetadata';

import { useContractRead } from 'wagmi'
import { useContractWrite } from 'wagmi'

import SimpleAccountABI from '../../../out/SimpleERC6551Account.sol/SimpleERC6551Account.json'
import ERC721 from '../../../out/ERC721.sol/ERC721.json'
import RegisterABI from '../../../out/ERC6551Registry.sol/ERC6551Registry.json' 

export const GridCard = ({
  cid,
  tokenId,
  tokenContract,
}) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const { data: NFTData, isLoading: isNFTDataLoading } = useGetCIDData(cid)

  const accountRegisterParams = [ '0xEc3CdC2A15D4D058A3Ad37ecDbBc9c7b4c5Fb735', 5001, tokenContract, tokenId, 0 ]
  
  const { data: TBAAddress, isLoading: isTBAAccount } = useContractRead({
    address: '0x5EfE84aaade508741AcfA1853b4A732d0095F2E6',
    abi: RegisterABI.abi,
    functionName: 'account',
    args: accountRegisterParams
  })

  const {
    data: approveData,
    isLoading: isApproveLoading,
    isSuccess: isApproveSuccess,
    write: approveMarket
  } = useContractWrite({
    address: tokenContract,
    abi: ERC721.abi,
    functionName: 'approve',
    args: [ '0xd57082Eb808573164f4A92898c03CBc695E4CaFF', tokenId ]
  })

  function SellModal() {
    const style = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 400,
      bgcolor: 'background.paper',
      border: '2px solid #000',
      boxShadow: 24,
      p: 4,
    };

    console.log(data, isLoading, isSuccess)
    return (
      <div>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Place bid 
            </Typography>
            <Button onClick={() => approveMarket()}>Approve</Button>
            <Button>Sign</Button>
            <Button>Place bid</Button>
          </Box>
        </Modal>
      </div>
    );
  }

  return (
    <>
    <SellModal />
    {!isNFTDataLoading
      && (
        <Card sx={{ maxWidth: 300, minWidth: 200 }}>
          <CardMedia
            sx={{ height: 160 }}
            image={NFTData?.image}
            title="NFTImage"
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
            <Button onClick={handleOpen} size="small">Sell</Button>
          </CardActions>
        </Card>
      )
    }
    </>
  );
};
