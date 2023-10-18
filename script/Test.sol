// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC6551Registry} from "erc6551/ERC6551Registry.sol";
import {SimpleERC6551Account} from "erc6551/examples/simple/SimpleERC6551Account.sol";
import {IERC6551Account} from "erc6551/interfaces/IERC6551Account.sol";
// import {IERC721} from "openzeppelin-contracts/token/ERC721/IERC721.sol";
import {ERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";
import {Market} from "../src/Market.sol";
import {SimpleAccount} from "../src/Account.sol";

import {Script, console2} from "forge-std/Script.sol";

contract NFT is ERC721 {
    constructor(string memory name, string memory symbol) ERC721(name, symbol) {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

contract TestScript is Script {
    function setUp() public {}

    function run() public {
        
        uint256 sellerPK = vm.envUint("SELLER_PRIVATE_KEY");
        uint256 buyerPK = vm.envUint("BUYER_PRIVATE_KEY");

        vm.startBroadcast();
        NFT nft = new NFT("Bleep", "BLP");
        ERC6551Registry registry = new ERC6551Registry();
        SimpleAccount implementation = new SimpleAccount();
        Market market = new Market();
        vm.stopBroadcast();
        


        console2.log("implementation", address(implementation));
        vm.deal(vm.addr(sellerPK), 2 ether);
        vm.deal(vm.addr(buyerPK), 2 ether);
        console2.log('seller', vm.addr(sellerPK), vm.addr(sellerPK).balance);
        console2.log('buyer', vm.addr(buyerPK), vm.addr(buyerPK).balance);

        vm.startBroadcast(sellerPK);

        console2.log('mint nft');
        nft.mint(vm.addr(sellerPK), 1);

        console2.log('create account for seller');
        SimpleAccount account = SimpleAccount(payable(registry.createAccount(
            address(implementation),
            31337,
            address(nft),
            1,
            0,
            ""
        )));

        console2.log('owner', account.owner());
        console2.log('nonce', account.nonce());

        // aprove market to transfer nft
        nft.approve(address(market), 1);

        // sign permission
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(sellerPK, account.lockHash());
        bytes memory signature = abi.encodePacked(r, s, v);

        market.publish(
            address(account),
            0.1 ether,
            signature
        );
        
        vm.stopBroadcast();

        vm.startBroadcast(buyerPK);


        console2.log('buying account');
        market.buy{value: 0.1 ether}(address(account));

        vm.stopBroadcast();
    }
}
