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
        uint256 index;
    }

    mapping(address => Listing) private _listingsInfo;
    address[] private _listings;

    constructor() {}

    function publish(
        address account,
        uint256 price,
        bytes memory lockSignature
    ) public {

        SimpleAccount acc = SimpleAccount(payable(account));
        require(msg.sender == acc.owner(), "");

        acc.lock(lockSignature);

        _listingsInfo[account] = Listing(
            price,
            acc.nonce(),
            _listings.length
        );
        _listings.push(account);
    }

    function listingInfo(address account) external view returns (Listing memory){
        return _listingsInfo[account];
    }
    function listingsInfo(address[] memory accounts) external view returns (Listing[] memory){
        Listing[] memory results = new Listing[](accounts.length);
        for (uint i = 0; i < accounts.length; i++) {
            results[i] = _listingsInfo[accounts[i]];
        }
        return results;
    }

    function listings(uint256 from, uint256 amount) 
        external view returns(address[] memory)
    {
        address[] memory results = new address[](amount);

        if (from + amount > _listings.length) {
            amount = _listings.length - from;
        }

        for (uint256 i = 0; i < amount; ++i) {
            // results[i] = _listingsInfo[_listings[from + i]];
            results[i] = _listings[from + i];
        }

        return results;
    }


    function listings() external view returns(address[] memory)
    {
        address[] memory results = new address[](_listings.length);

        for (uint256 i = 0; i < _listings.length; ++i) {
            results[i] = _listings[i];
        }

        return results;
    }

    function buy(address account) public payable {

        SimpleAccount acc = SimpleAccount(payable(account));
        (uint256 chainId, address tokenContract, uint256 tokenId) = acc.token();
        address seller = acc.owner();

        // check chainId?

        Listing memory listing = _listingsInfo[account];

        (bool sent,) = seller.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        uint256 price = listing.price;
        require(msg.value == price, "Incorrect price");

        require(acc.nonce() == listing.lockedNonce, "Account is unlocked");

        IERC721(tokenContract).transferFrom(
            IERC721(tokenContract).ownerOf(tokenId),
            msg.sender,
            tokenId
        );

        // save bought listing index in listing array
        uint256 boughtIndex = listing.index;
        // delete bought listing from mapping
        delete _listingsInfo[account];

        if (_listings.length > 1) {
            // overwrite listing[boughtIndex] with last listing from array
            _listings[boughtIndex] = _listings[_listings.length - 1];
            // update moved listing index
            _listingsInfo[_listings[boughtIndex]].index = boughtIndex;
            // delete last listing
            _listings.pop();
        } else {
            delete _listings[0];
        }

    }
}
