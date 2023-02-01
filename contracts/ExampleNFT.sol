// SPDX-License-Identifier: UNLICENCED
pragma solidity ^0.8.17;

import "../node_modules/@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract ExampleNFT is ERC721URIStorage, Ownable {
	using Counters for Counters.Counter;
	Counters.Counter private _tokenCounter;

	constructor() ERC721("Example NFT", "EXMPLNFT") {

	}

	function _createCollectible(string memory _tokenURI) public onlyOwner returns (uint256) {
		uint256 newItemId = _tokenCounter.current();
		_safeMint(owner(), newItemId);
		_setTokenURI(newItemId, _tokenURI);
		_tokenCounter.increment();
		return newItemId;
	}
}