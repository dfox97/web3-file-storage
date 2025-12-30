// SPDX-License-Identifier: MIT
// https://repo.sourcify.dev/11155111/0xe23DC849ae3D0F8614Ee3035eBE0C14194C793c6
// https://eth-sepolia.blockscout.com/address/0xe23DC849ae3D0F8614Ee3035eBE0C14194C793c6?tab=contract
pragma solidity ^0.8.20;

contract IPFSFileStore {
    struct Document {
        string cid;
        string name;
        uint256 timestamp;
    }

    mapping(address => Document[]) private userDocuments;

    event DocumentAdded(address indexed user, string cid, string name, uint256 timestamp);

    function addDocument(string memory cid, string memory name) external {
        require(bytes(cid).length > 0, "CID required");

        Document memory doc = Document({ cid: cid, name: name, timestamp: block.timestamp });
        userDocuments[msg.sender].push(doc);

        emit DocumentAdded(msg.sender, cid, name, block.timestamp);
    }

    function getDocumentCount(address user) external view returns (uint256) {
        return userDocuments[user].length;
    }

    function getDocument(address user, uint256 index)
        external
        view
        returns (string memory cid, string memory name, uint256 timestamp)
    {
        require(index < userDocuments[user].length, "Invalid index");
        Document memory doc = userDocuments[user][index];
        return (doc.cid, doc.name, doc.timestamp);
    }

    function getAllDocuments(address user) external view returns (Document[] memory) {
        return userDocuments[user];
    }
}
