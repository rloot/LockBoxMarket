import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import {
  useContractRead,
  useContractWrite,
  useSignTypedData,
} from 'wagmi'

import ERC721 from '../../../out/ERC721.sol/ERC721.json'
import RegisterABI from '../../../out/ERC6551Registry.sol/ERC6551Registry.json' 
import SimpleAccountABI from '../../../out/Account.sol/SimpleAccount.json'
import MarketABI from '../../../out/Market.sol/Market.json'

export const SellModal = ({
  tokenContract,
  tokenId,
  open,
  setOpen,
}) => {
  const handleClose = () => setOpen(false);

  const accountRegisterParams = ['0xEc3CdC2A15D4D058A3Ad37ecDbBc9c7b4c5Fb735', 5001, tokenContract, tokenId, 0]

  const { data: TBAAddress, isLoading: isTBAAccountLoading } = useContractRead({
    address: '0x5EfE84aaade508741AcfA1853b4A732d0095F2E6',
    abi: RegisterABI.abi,
    functionName: 'account',
    args: accountRegisterParams
  })

  const { data: lockHash, isLoading: isLockHashLoading } = useContractRead({
    address: TBAAddress,
    abi: SimpleAccountABI.abi,
    functionName: 'lockHash',
    enabled: !isTBAAccountLoading && !!TBAAddress && open
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
    args: ['0xd57082Eb808573164f4A92898c03CBc695E4CaFF', tokenId]
  })

  const { data: nonce } = useContractRead({
    address: TBAAddress,
    abi: SimpleAccountABI.abi,
    functionName: 'nonce',
  })

  const domain = {
    name: 'SimpleAccount',
    version: '1.0.0',
    chainId: 5001,
    verifyingContract: '0xEc3CdC2A15D4D058A3Ad37ecDbBc9c7b4c5Fb735',
  } as const

  const types = {
    Lock: [
      { name: 'owner', type: 'address' },
      { name: 'nonce', type: 'uint256' },
    ],
  } as const

  const message = {
    owner: '0x48F54e595bf039CF30fa5F768c0b57EAC6508a06'.toLocaleLowerCase(),
    nonce: nonce
  } as const

  const {
    data: lockHashSignatureData,
    isError: isLockHashSignatureError,
    isLoading: isLockHashSignatureLoading,
    isSuccess: isLockHashSignatureSuccess,
    signTypedData
  } = useSignTypedData({
    domain,
    message,
    primaryType: 'Lock',
    types,
  })

  const {
    data: publishData,
    isLoading: isPublishLoading,
    isSuccess: isPublishSuccess,
    write: publish
  } = useContractWrite({
    address: '0x3c601dae77F6f5cAba83a2648c77ebff17576F06',
    abi: MarketABI.abi,
    functionName: 'publish',
    args: [TBAAddress, 1n, lockHashSignatureData]
  })

  const {
    data: lockData,
    isLoading: isLockLoading,
    isSuccess: isLockSuccess,
    write: lock
  } = useContractWrite({
    address: TBAAddress,
    abi: SimpleAccountABI.abi,
    functionName: 'lock',
    args: [lockHashSignatureData]
  })

  const { data: isValidSignature, error: isValidSignatureERROR } = useContractRead({
    address: TBAAddress,
    abi: SimpleAccountABI.abi,
    functionName: 'isValidSignature',
    args: [lockHash, lockHashSignatureData],
  })

  console.log(domain, message, isValidSignature)

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
          <Button onClick={() => approveMarket()}>Approve</Button>
          <Button onClick={() => signTypedData()}>Sign</Button>
          <Button onClick={() => publish()}>Place bid</Button>
        </Box>
      </Modal>
    </div>
  );
}
