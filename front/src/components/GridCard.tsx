import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useGetCIDData } from '../hooks/useGetCIDMetadata';

export const GridCard = ({ cid }) => {
  const { data: NFTData, isLoading } = useGetCIDData(cid)

  return (
    <>
    {!isLoading
      && (
        <Card sx={{ maxWidth: 300 }}>
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
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      )
    }
    </>
  );
};
