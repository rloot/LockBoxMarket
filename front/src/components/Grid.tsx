import { useState } from 'react';
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import { GridCard } from "./GridCard"



export const Grid = ({ NFTs }) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function BasicModal() {

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
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </Typography>
          </Box>
        </Modal>
      </div>
    );
  }

  return (
    <>
      <BasicModal />
      <Stack direction="row" spacing={4} useFlexGap flexWrap="wrap">
        {NFTs && NFTs.map(nft =>{
          return (
          <GridCard
            key={nft.cid}
            cid={nft.cid}
            tokenId={nft.token_id}
            tokenContract={nft.contract_address}
            modalHandleOpen={handleOpen}
          />
          )
        })}
      </Stack>
    </>
  )
};
