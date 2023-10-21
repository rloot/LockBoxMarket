import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useGetCIDData } from '../hooks/useGetCIDMetadata';

import { SellModal } from './SellModal';
import { useState } from 'react';

export const GridCard = ({
  cid,
  tokenId,
  tokenContract,
}) => {
  const { data: NFTData, isLoading: isNFTDataLoading } = useGetCIDData(cid)

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
    <SellModal
      tokenContract={tokenContract}
      tokenId={tokenId}
      open={open}
      setOpen={setOpen}
    />
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
