import { useContractRead } from 'wagmi'
import SimpleAccountABI from '../../../out/SimpleERC6551Account.sol/SimpleERC6551Account.json'
 
const contractRead = useContractRead({
    address: '0xecb504d39723b0be0e3a9aa33d646642d1051ee1',
    abi: SimpleAccountABI,
    functionName: 'getSleep',
})