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
            // results[i] = _listingsInfo[_listings[i]];
        }

        return results;
    }

    function buy(address account) public payable {
        SimpleAccount acc = SimpleAccount(payable(account));

        (uint256 chainId, address tokenContract, uint256 tokenId) = acc.token();
        address seller = acc.owner();

        // check chainId?

        uint256 price = _listingsInfo[account].price;

        (bool sent,) = seller.call{value: msg.value}("");
        require(sent, "Failed to send Ether");

        require(msg.value == price, "Incorrect price");

        require(acc.nonce() == _listingsInfo[account].lockedNonce, "Account is unlocked");

        IERC721(tokenContract).transferFrom(
            IERC721(tokenContract).ownerOf(tokenId),
            msg.sender,
            tokenId
        );

        uint256 prevPos = _listingsInfo[account].index;
        delete _listingsInfo[account];

        if (_listings.length > 1) {
            // get sold listing index in listing array
            // overwrite listing at prevPos index with last listing
            _listings[prevPos] = _listings[_listings.length - 1];
            // update listingInfo index with prevPos
            _listingsInfo[_listings[prevPos]].index = prevPos;
            // delete last listing
            _listings.pop();
        } else {
            delete _listings[0];
        }

    }
}
