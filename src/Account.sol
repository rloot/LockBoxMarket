// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "erc6551/interfaces/IERC6551Account.sol";
import "erc6551/lib/ERC6551AccountLib.sol";

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/introspection/IERC165.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import {console2} from "forge-std/console2.sol";

contract SimpleAccount is IERC165, IERC1271, IERC6551Account {
    
    uint256 public nonce;
    bool locked;
    using ECDSA for bytes32;

    event Locked(uint256 lockedUntil, uint256 nonce);

    receive() external payable {}

    function lockHash() public view returns (bytes32 op712Hash) {
        bytes32 domainSeparator = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("SimpleAccount")),
                keccak256(bytes("1.0.0")),
                block.chainid,
                address(this)
            )
        );
        bytes32 hashStruct = keccak256(
            abi.encode(
                keccak256("Lock(address owner,uint256 nonce)"),
                owner(),
                nonce
            )
        );

        op712Hash = MessageHashUtils.toTypedDataHash(domainSeparator, hashStruct);
    }

    function lock(
        bytes memory permission
    ) public {
        bytes4 valid = _isValidSignature(
            lockHash(),
            permission
        );
        if (valid != IERC1271.isValidSignature.selector) revert();

        ++nonce;

        locked = true;
    }

    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(msg.sender == owner(), "Not token owner");

        ++nonce;

        emit TransactionExecuted(to, value, data);

        bool success;
        (success, result) = to.call{value: value}(data);

        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function token()
        external
        view
        returns (
            uint256,
            address,
            uint256
        )
    {
        return ERC6551AccountLib.token();
    }

    function owner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId);
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        return _isValidSignature(hash, signature);
    }
    function _isValidSignature(bytes32 hash, bytes memory signature)
        internal
        view
        returns (bytes4 magicValue)
    {
        console2.log(owner());
        bool isValid = SignatureChecker.isValidSignatureNow(owner(), hash, signature);

        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }
}