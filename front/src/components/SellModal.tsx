import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';

import {
  useContractRead,
  useContractWrite,
  useSignTypedData,
  useNetwork,
  useAccount
} from 'wagmi'

import { addressesByChain } from '../globals';
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
  const { chain } = useNetwork();
  const { address: connectedAddress } = useAccount();

  const ADDRESSES =  addressesByChain[chain?.id ?? 5001];

  const accountRegisterParams = [ADDRESSES.ACCOUNT_IMPLEMENTATION, 5001, tokenContract, tokenId, 0]
  const { data: TBAAddress, isLoading: isTBAAccountLoading } = useContractRead({
    address: ADDRESSES.REGISTRY,
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
    args: [ADDRESSES.MARKET, tokenId]
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
    verifyingContract: ADDRESSES.ACCOUNT_IMPLEMENTATION,
  } as const

  const types = {
    Lock: [
      { name: 'owner', type: 'address' },
      { name: 'nonce', type: 'uint256' },
    ],
  } as const

  const message = {
    owner: connectedAddress,
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
    address: ADDRESSES.MARKET,
    abi: MarketABI.abi,
    functionName: 'publish',
    args: [TBAAddress, 1n, lockHashSignatureData]
  })

  console.log(TBAAddress);

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
        onClose={() => setOpen(false)}
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
