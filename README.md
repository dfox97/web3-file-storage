# Decentralized File Uploader

A simple Web3 application that allows users to upload documents to IPFS and store the resulting IPFS hash on the Ethereum blockchain. This provides a decentralized way to store, verify, and retrieve document data.

## How It Works
- Upload a file from the UI
- File is stored on IPFS (decentralized storage)
- The IPFS hash is saved to an Ethereum smart contract
- Users can retrieve and verify stored documents using the contract

## Features
- IPFS file storage
- Ethereum smart contract for hash storage
- Web3 wallet integration (MetaMask)
- Document upload, retrieval, and verification UI

## Requirements
- MetaMask wallet
- Ethereum Sepolia Test Network
- Test ETH for gas fees (use a faucet such as https://cloud.google.com/application/web3/faucet/ethereum/sepolia)

## Tech Stack
- Angular frontend
- Solidity smart contract
- IPFS decentralized storage
- Web3.js for blockchain interaction
