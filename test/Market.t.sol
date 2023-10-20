// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {ERC6551Registry} from "erc6551/ERC6551Registry.sol";
import {SimpleERC6551Account} from "erc6551/examples/simple/SimpleERC6551Account.sol";
import {IERC6551Account} from "erc6551/interfaces/IERC6551Account.sol";
// import {IERC721} from "openzeppelin-contracts/token/ERC721/IERC721.sol";
import {ERC721} from "openzeppelin-contracts/token/ERC721/ERC721.sol";
import {Market} from "../src/Market.sol";
import {SimpleAccount} from "../src/Account.sol";

contract NFT is ERC721 {
    constructor(
        string memory name,
        string memory symbol
    ) ERC721(name, symbol) {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
}

contract MarketTest is Test {
    Market market;
    NFT nft;
    ERC6551Registry registry;
    SimpleAccount implementation;

    uint256 constant SELLER_PK = uint256(keccak256('seller'));
    uint256 constant BUYER_PK = uint256(keccak256('buyer'));
    address SELLER;
    address BUYER;

    // uint256
    function setUp() public {
        SELLER = vm.addr(uint256(keccak256('seller')));
        BUYER = vm.addr(uint256(keccak256('buyer')));

        nft = new NFT("Bleep", "BLP");
        registry = new ERC6551Registry();
        implementation = new SimpleAccount();
        market = new Market();
    }

    function test_AccountInitialization() public {
        nft.mint(SELLER, 1);

        address payable account = payable(
            registry.createAccount(
                address(implementation),
                31337,
                address(nft),
                1,
                0,
                ""
            )
        );
        assertEq(SimpleAccount(account).nonce(), 0);
    }
    function test_MarketInitialization() public {

    }
    function test_publish() public {
        nft.mint(SELLER, 1);

        address payable account = createAccount(address(nft), 1);

        bytes memory permission = lockPermission(SELLER_PK, account);

        vm.prank(SELLER);
        market.publish(account, 1 ether, permission);

        Market.Listing memory listing = market.listingInfo(account);
        assertEq(listing.price, 1 ether);
        assertEq(listing.lockedNonce, 1);
    }

    function test_buy() public {
        nft.mint(SELLER, 1);

        address payable account = createAccount(address(nft), 1);

        bytes memory permission = lockPermission(SELLER_PK, account);

        vm.startPrank(SELLER);
        market.publish(account, 1 ether, permission);
        nft.approve(address(market), 1);
        vm.stopPrank();

        vm.deal(BUYER, 1 ether);

        vm.prank(BUYER);
        market.buy{value: 1 ether}(account);

        assertEq(nft.ownerOf(1), BUYER);
        assertEq(SimpleAccount(account).owner(), BUYER);
    }
    function test_buy_unlocked() public {
        nft.mint(SELLER, 1);

        address payable account = createAccount(address(nft), 1);

        bytes memory permission = lockPermission(SELLER_PK, account);

        vm.startPrank(SELLER);
        market.publish(account, 1 ether, permission);
        nft.approve(address(market), 1);
        SimpleAccount(account).unlock(unlockPermission(SELLER_PK, account));
        vm.stopPrank();

        vm.deal(BUYER, 1 ether);

        vm.startPrank(BUYER);
        vm.expectRevert("Account is unlocked");
        market.buy{value: 1 ether}(account);
    }


    function test_buy_unlocked_and_locked() public {
        nft.mint(SELLER, 1);

        address payable account = createAccount(address(nft), 1);

        bytes memory permission = lockPermission(SELLER_PK, account);

        vm.startPrank(SELLER);
        market.publish(account, 1 ether, permission);
        nft.approve(address(market), 1);
        SimpleAccount(account).unlock(unlockPermission(SELLER_PK, account));
        SimpleAccount(account).lock(lockPermission(SELLER_PK, account));
        vm.stopPrank();

        assertEq(SimpleAccount(account).locked(), true);

        vm.deal(BUYER, 1 ether);

        vm.startPrank(BUYER);

        vm.expectRevert("Account is unlocked");
        market.buy{value: 1 ether}(account);
    }

    function test_listing_getters() public {
        uint256 amount = 11;
        address[] memory accounts = new address[](amount); 

        vm.startPrank(SELLER);        
        for (uint i = 0; i < amount; i++) {
            nft.mint(SELLER, i);
            address account = createAccount(address(nft), i);
            accounts[i] = account;
            bytes memory permission = lockPermission(SELLER_PK, account);
            nft.approve(address(market), i);
            market.publish(account, 1 ether, permission);
            Market.Listing memory listing = market.listingInfo(account);
            assertEq(listing.price, 1 ether);
            assertEq(listing.index, i);
            console2.log(i, account);
        }
        vm.stopPrank();


        vm.deal(BUYER, 1 ether);

        vm.prank(BUYER);
        market.buy{value: 1 ether}(accounts[1]);

        address[] memory listings = market.listings();
        assertEq(listings.length, amount - 1);
        assertEq(market.listingInfo(listings[1]).index, 1);

    }

    /// utils

    function createAccount(
        address tokenContract,
        uint256 tokenId
    ) internal returns (address payable) {
        return payable(
            registry.createAccount(
                address(implementation),
                31337,
                tokenContract,
                tokenId,
                0,
                ""
            )
        );        
    }

    function lockPermission(uint256 pk, address account) internal view returns(bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            pk,
            SimpleAccount(payable(account)).lockHash()
        );
        return abi.encodePacked(r, s, v);
    }
    function unlockPermission(uint256 pk, address account) internal view returns(bytes memory) {
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(
            pk,
            SimpleAccount(payable(account)).unlockHash()
        );
        return abi.encodePacked(r, s, v);
    }


}
