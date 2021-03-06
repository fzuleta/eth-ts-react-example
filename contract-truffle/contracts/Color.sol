pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";

contract Color is ERC721PresetMinterPauserAutoId {
  string[] public colors;
  mapping(string => bool) _colorExists;

  constructor() ERC721PresetMinterPauserAutoId("Color", "COLOR", "http://color.com/token") public {
    //
  }
  function mint(string memory _color) public {
    require(!_colorExists[_color]);
    colors.push(_color);
    uint _id = colors.length - 1;
    _mint(msg.sender, _id);
    _colorExists[_color] = true;
  }
}