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

  // Sepolia is the active testnet, Goerli is discontinued.
  protected _web3: Web3;
  protected contractAddress = '0x39317824539b9B348859dC04aa569Ae653229920';
  protected contractAbi = abiKey;

  constructor() {
    if (typeof window !== 'undefined' && window.ethereum) {
      this._web3 = new Web3(window.ethereum);
    } else {
      this._web3 = new Web3('https://rpc2.sepolia.org');
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
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error("MetaMask not found. Please install MetaMask.");
    }

    try {
      let provider = window.ethereum;

      // Handle multiple providers (common in Brave or with multiple wallets)
      if (window.ethereum.providers?.length) {
        provider = window.ethereum.providers.find((p: any) => p.isMetaMask) || window.ethereum.providers[0];
      }

      // Ensure we are using the correct provider
      this._web3.setProvider(provider);

      // Request accounts
      const accounts = await provider.request({ method: 'eth_requestAccounts' });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }

      this.accountSig.set(accounts[0]);

      const _contract = new this._web3.eth.Contract<ContractAbi>(this.contractAbi, this.contractAddress, {
        from: this.accountSig(),
      })

      this.contractSig.set(_contract);

      return this._web3;
    } catch (error: any) {
      console.error("Detailed Web3 Error:", error);

      if (error.code === -32603) {
        if (window.ethereum.isBraveWallet && !window.ethereum.isMetaMask) {
          console.error("Brave Wallet conflict detected. Please go to brave://settings/web3 and set 'Default Ethereum wallet' to 'Extensions (MetaMask)'");
        }
      }
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


