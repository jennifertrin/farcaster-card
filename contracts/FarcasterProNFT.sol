// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract FarcasterProNFT is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId = 1; // Start from 1 instead of 0
    
    uint256 public constant MINT_PRICE = 0.005 ether;
    
    constructor() ERC721("Farcaster Pro Membership Card", "FARPRO") Ownable(msg.sender) {}
    
    function mint(string memory _tokenURI) public payable returns (uint256) {
        require(msg.value == MINT_PRICE, "Incorrect payment amount");
        
        uint256 tokenId = _nextTokenId++;
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        
        return tokenId;
    }
    
    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(owner()).transfer(balance);
    }
    
    function totalSupply() public view returns (uint256) {
        return _nextTokenId - 1;
    }
    
    // Required overrides for multiple inheritance
    function tokenURI(uint256 tokenId) 
        public 
        view 
        virtual 
        override(ERC721, ERC721URIStorage) 
        returns (string memory) 
    {
        return super.tokenURI(tokenId);
    }
    
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}