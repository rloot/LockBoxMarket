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
import "@openzeppelin/contracts/utils/cryptography/MessageHashUtils.sol";

import {console2} from "forge-std/console2.sol";

import "./EIP1271.sol";

contract SimpleAccount is EIP1271("SimpleAccount"), IERC721Receiver, IERC6551Account {
    
    uint256 private _nonce;
    bool private _locked;
    using ECDSA for bytes32;

    event Locked(uint256 lockedUntil, uint256 nonce);

    bytes32 constant LOCK_TYPEHASH = keccak256("Lock(address owner,uint256 nonce)");
    bytes32 constant UNLOCK_TYPEHASH = keccak256("Unlock(address owner,uint256 nonce)");

    constructor() {}

    function lockHash() public view returns (bytes32) {
        bytes32 hashStruct = keccak256(abi.encode(LOCK_TYPEHASH, owner(), _nonce));
        return MessageHashUtils.toTypedDataHash(DOMAIN_SEPARATOR, hashStruct);
    }
    function unlockHash() public view returns (bytes32) {
        bytes32 hashStruct = keccak256(abi.encode(UNLOCK_TYPEHASH, owner(), _nonce));
        return MessageHashUtils.toTypedDataHash(DOMAIN_SEPARATOR, hashStruct);
    }

    function isLocked() public view returns (bool) {
        return _locked;
    }

    function nonce() public view virtual returns (uint256) {
        return _nonce;
    }

    function lock(
        bytes memory permission
    ) isValid(lockHash(), permission) public {

        ++_nonce;

        _locked = true;
    }

    function unlock(
        bytes memory permission
    ) isValid(unlockHash(), permission) public {

        ++_nonce;

        _locked = false;
    }

    function executeCall(
        address to,
        uint256 value,
        bytes calldata data
    ) external payable returns (bytes memory result) {
        require(msg.sender == owner(), "Not token owner");

        ++_nonce;

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

    function owner() public view override(EIP1271, IERC6551Account) returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = this.token();
        if (chainId != block.chainid) return address(0);

        return IERC721(tokenContract).ownerOf(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public pure returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId);
    }

    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

   receive() external payable {}

}