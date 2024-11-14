// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TokenLand is ERC721, Ownable {
    uint256 public productCount;

    struct Property {
        string location;
        uint256 price;
        bool forSale;
    }

    mapping(uint256 => Property) public properties;

    event PropertyListed(uint256 tokenId, string location, uint256 price);
    event PropertySold(uint256 tokenId, address buyer, uint256 price);

    constructor(address initialOwner) ERC721("TokenLand", "TLAND") Ownable(initialOwner) {
        productCount = 0;
    }

    function mintProperty(string memory location, uint256 price) public onlyOwner {
        productCount++;
        uint256 newTokenId = productCount;
        _safeMint(msg.sender, newTokenId);
        properties[newTokenId] = Property(location, price, true);
        emit PropertyListed(newTokenId, location, price);
    }

    function buyProperty(uint256 tokenId) public payable {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        require(properties[tokenId].forSale, "Property is not for sale");
        require(msg.value >= properties[tokenId].price, "Insufficient funds");

        address seller = ownerOf(tokenId);
        _transfer(seller, msg.sender, tokenId);
        properties[tokenId].forSale = false;

        payable(seller).transfer(msg.value);

        emit PropertySold(tokenId, msg.sender, msg.value);
    }

    function listPropertyForSale(uint256 tokenId, uint256 newPrice) public {
    require(ownerOf(tokenId) == msg.sender, "Not the owner");
    require(newPrice <= properties[tokenId].price, "New price must be less than or equal to the original price");
    properties[tokenId].forSale = true;
    properties[tokenId].price = newPrice;
    emit PropertyListed(tokenId, properties[tokenId].location, newPrice);
}

    function getProperty(uint256 tokenId) public view returns (Property memory) {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        return properties[tokenId];
    }
}