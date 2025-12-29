// SPDX-License-Identifier: TEST-DANNY / Sepolia test network
//https://sepolia.etherscan.io/tx/0x9cfaf63edcf9beffff802243d2841b1bb13fa12c6fee161a160debbb1150ee9e
// New: https://repo.sourcify.dev/11155111/0xCC31BB7d0E2dF7d2432288C697489Cf2FD417512
// https://eth-sepolia.blockscout.com/address/0xCC31BB7d0E2dF7d2432288C697489Cf2FD417512?tab=contract
pragma solidity ^0.8.19;
contract TestIpfsDocument {

    struct File {
        string fileName;
        string hash;
        string URL;

    }
    mapping(address => File[]) files;


    function add(string memory _fileName, string memory _hash, string memory _url) public {
        files[msg.sender].push(File({fileName: _fileName, hash: _hash, URL: _url}));

    }

    function getFile(uint _index) public view returns(string memory, string memory, string memory) {
        File memory file = files[msg.sender][_index];
        return(file.fileName, file.hash, file.URL);

    }

    function getLength() public view returns(uint) {
        return files[msg.sender].length;
    }

    function getHash() public view returns(string memory){
        File memory file = files[msg.sender][0];
        return file.hash;
    }

    function verifyDocument(uint index, string memory hashToVerify) public view returns (bool){
       File memory file = files[msg.sender][index];
       return (keccak256(abi.encodePacked((hashToVerify))) == keccak256(abi.encodePacked((file.hash))));
     }
}
