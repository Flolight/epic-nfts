// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

import { Base64 } from "./libraries/Base64.sol";


contract MyEpicNFT is ERC721URIStorage {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string baseSVG = "<svg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='xMinYMin meet' viewBox='0 0 350 350'><style>.base { fill: white; font-family: serif; font-size: 34px; }</style><rect width='100%' height='100%' fill='#7CC6FE'/><text x='50%' y='30%' class='base' dominant-baseline='middle' text-anchor='middle'>Ceci n'est pas un NFT,</text><text x='50%' y='55%' class='base' dominant-baseline='middle' text-anchor='middle'> c'est ";
    string[] randomWords = ["une fourchette", "une crevette", "une planette", "une carte", "une brouette", "une invention", "une coccinelle", "un ballon", "un minigolf", "un panier", "un entonnoir", "un rongeur", "un mirage", "un parachute"];

    constructor() ERC721 ("NonNFT-NFT", "NNFT") {
        console.log("This is my awesome NFT Contract. Isn't that great?!!");
    }

    function pickRandomWord(uint256 tokenId) public view returns (string memory) {
        uint256 rand = random(string(abi.encodePacked("FIRST_WORD", Strings.toString(tokenId))));
        rand = rand % randomWords.length;
        return randomWords[rand];
    }

    function random(string memory input) internal pure returns (uint256) {
        return uint256(keccak256(abi.encodePacked(input)));
    }

    function makeAnEpicNFT() public {

        uint256 newItemId = _tokenIds.current();

        string memory word = pickRandomWord(newItemId);

        string memory finalSVG = string(abi.encodePacked(baseSVG, word, " !</text></svg>"));

        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        word,
                        '", "description": "A highly acclaimed collection of non-NFT.", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSVG)),
                    '"}')
                )
            )
        );
        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        console.log("\n--------------------");
        console.log(finalTokenUri);
        console.log("--------------------\n");
        
        _safeMint(msg.sender, newItemId);

        _setTokenURI(newItemId, finalTokenUri);
        console.log("An NFT with ID %d has been minted to %s", newItemId, msg.sender);

        _tokenIds.increment();
    }
}