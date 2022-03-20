//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";

contract Ape is ERC721, ERC721URIStorage, Ownable, AccessControl, Pausable, ERC721Burnable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenCounter;
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    address public contractOwner;
    mapping(string => uint8) existingURIs;

    // call the parent ERC721Royalty constructor
    constructor() ERC721("Ape", "APE")
    {
        // grant contract owner some roles: ability to pause, ability to mint, ability as an admin
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        contractOwner = msg.sender;
    }

    // overide _baseURI() in the parent ERC721, add in 'ipfs' in front to form URI
    function _baseURI() internal pure override returns (string memory) {
        return "ipfs://";
    }

    // safe-mint NFT, only address with MINTER_ROLE can mint
    function safeMint(address to, string memory uri) payable public onlyRole(MINTER_ROLE) 
    {
        require(existingURIs[uri] != 1, 'Ape is already minted');
        require (msg.value >= 0.05 ether, 'Insufficient amount to mint');

        uint256 tokenId = _tokenCounter.current();
        _tokenCounter.increment();
        existingURIs[uri] = 1;
        _mint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // check if uri is owned
    function isContentOwned(string memory uri) public view returns (bool)
    {
        return existingURIs[uri] == 1;
    }

    // pause and unpause an NFT minting campaign
    function pause() public onlyRole(PAUSER_ROLE) 
    {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) 
    {
        _unpause();
    }

    // overide _beforeTokenTransfer so that no token is transferred when the campaign is paused
    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        whenNotPaused
        override
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    // get how many token has been issued
    function getTokenCount() public view returns(uint256) {
        return _tokenCounter.current();
    }

    // the following functions are overrides required by Solidity.
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
