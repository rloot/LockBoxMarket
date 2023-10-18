// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC6551Registry} from "erc6551/ERC6551Registry.sol";
import {IERC6551Account} from "erc6551/interfaces/IERC6551Account.sol";

import {SimpleAccount} from "./Account.sol";

import {IERC721} from "openzeppelin-contracts/token/ERC721/IERC721.sol";

import {console2} from "forge-std/console2.sol";

contract Market {

    struct Listing {
        uint256 price;
        uint256 lockedNonce;
    }

    mapping(address => Listing) public listings;

    constructor() {}

    function publish(
        address account,
        uint256 price,
        bytes memory lockSignature
    ) public {

        SimpleAccount acc = SimpleAccount(payable(account));
        require(msg.sender == acc.owner(), "");

        acc.lock(lockSignature);

        listings[account] = Listing(
            price,
            acc.nonce()
        );
    }

    function buy(address account) public payable {
        SimpleAccount acc = SimpleAccount(payable(account));

        (uint256 chainId, address tokenContract, uint256 tokenId) = acc.token();
        address seller = acc.owner();

        // check chainId?

        uint256 price = listings[account].price;

        (bool sent,) = seller.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        require(msg.value == price, "Incorrect price");

        require(acc.nonce() == listings[account].lockedNonce, "Account is unlocked");

        IERC721(tokenContract).transferFrom(
            IERC721(tokenContract).ownerOf(tokenId),
            msg.sender,
            tokenId
        );

        delete listings[account];

    }
}
