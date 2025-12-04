import { Injectable, signal } from '@angular/core';
import Web3, { Contract } from 'web3';
import { abiKey } from './contract/abi';
import { toObservable } from '@angular/core/rxjs-interop';

declare let window: any;

export interface IWeb3 {
  get web3(): Web3;
  initializeWeb3(): Promise<Web3>;
  getContract(): string;
}

type ContractAbi = typeof abiKey;

@Injectable({
  providedIn: 'root'
})
export class Web3Service implements IWeb3 {
  //user web3 instance
  public accountSig = signal<string | undefined>(undefined);
  public account$ = toObservable(this.accountSig);
  public contractSig = signal<Contract<ContractAbi> | undefined>(undefined);

  // TODO: Update endpoint to environment variable and support latest ethereum network
  // Sepolia is discontinued, consider using Goerli or another testnet
  protected _web3 = new Web3('https://rpc2.sepolia.org');
  protected contractAddress = '0xc447Da346b84b6973799CF08Fb1fb6F71f5b184B';
  protected contractAbi = abiKey;

  constructor() {
    if (window.ethereum) {
      this._web3 = new Web3("https://rpc2.sepolia.org");
    }
  }

  get web3(): Web3 {
    return this._web3;
  }

  get account(): string | undefined {
    return this.accountSig();
  }

  get contract(): Contract<ContractAbi> | undefined {
    return this.contractSig();
  }


  async initializeWeb3(): Promise<Web3> {
    if (!this._web3) {
      throw new Error("MetaMask not found. Please install MetaMask.");
    }

    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      this.accountSig.set(accounts[0]);

      const _contract = new this.web3.eth.Contract<ContractAbi>(this.contractAbi, this.contractAddress, {
        from: this.accountSig(),
      })

      this.contractSig.set(_contract);

      return this._web3;
    } catch (error) {
      console.error("User denied account access:", error);
      throw error;
    }
  }


  logOut(): void {
    this.accountSig.set(undefined);
  }

  getContract(): string {
    return this.contractAddress;
  }
}


