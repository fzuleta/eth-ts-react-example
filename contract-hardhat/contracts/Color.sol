//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/presets/ERC721PresetMinterPauserAutoId.sol";
import "hardhat/console.sol";

contract Color is ERC721PresetMinterPauserAutoId {
  string[] public colors;
  mapping(string => bool) _colorExists;

  constructor() ERC721PresetMinterPauserAutoId("Color", "COLOR", "http://color.com/token") {
    console.log("Contract created");
  }
  function mint(string memory _color) public {
    console.log("Trying to mint %s color", _color);
    require(!_colorExists[_color]);
    colors.push(_color);
    uint _id = colors.length - 1;
    _mint(msg.sender, _id);
    _colorExists[_color] = true;
  }
}