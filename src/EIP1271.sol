// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";

abstract contract EIP1271 is IERC1271 {
    
    using ECDSA for bytes32;

    bytes32 immutable DOMAIN_SEPARATOR;

    constructor(string memory NAME) {
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
               keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes(NAME)),
                keccak256(bytes("1.0.0")),
                block.chainid,
                address(this)
            )
        );
    }

    function owner() public view virtual returns (address);

    modifier isValid(bytes32 hash, bytes memory signature) {
        if (!SignatureChecker.isValidSignatureNow(owner(), hash, signature)) {
            revert("invalid signature");
        }
        _;
    }

    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        returns (bytes4 magicValue)
    {
        if (SignatureChecker.isValidSignatureNow(owner(), hash, signature)) {
            return IERC1271.isValidSignature.selector;
        }

        return "";
    }

}