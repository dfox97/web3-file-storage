import { Injectable, inject } from '@angular/core';
import { Web3Service } from './web3-connection.service';

interface FileResponse {
  "0": string; // fileName
  "1": string; // hash
  "2": string; // url
  "__length__": number;
}


export interface FileInfo {
  fileName: string;
  hash: string;
  url: string;
}

interface IDocUploderContract {
  add: (fileName: string, hash: string, url: string) => Promise<void>;
  getFile: (index: number) => Promise<FileInfo>;
  getHash: () => Promise<string>;
  getLength: () => Promise<number>;
  verifyDocument: (index: number, hashToVerify: string) => Promise<boolean>;
}


//TODO: Make this a seperate class and web3 service its own class.
@Injectable({
  providedIn: 'root'
})
export class EthDocUploaderService implements IDocUploderContract {
  #web3Service = inject(Web3Service);

  private get account() {
    return this.#web3Service.account;
  }

  private get contract() {
    return this.#web3Service.contract;
  }

  async add(fileName: string, hash: string, url: string): Promise<void> {
    if (!this.account) throw new Error('Account not found')
    if (!this.contract) throw new Error('Contract not found');

    try {
      await this.contract.methods.add(fileName, hash, url).send({ from: this.account });
    } catch (error) {
      console.error('Error adding file to blockchain:', error);
      throw new Error('Error adding file to blockchain');
    }
  }
  async getFile(index: number): Promise<FileInfo> {
    if (!this.contract) throw new Error('Contract not found');

    try {
      const result = await this.contract.methods.getFile(index).call<FileResponse>();

      return {
        fileName: result[0],
        hash: result[1],
        url: result[2],
      };
    } catch (error) {
      console.error('Error getting file from blockchain:', error);
      throw new Error('Error getting file from blockchain');
    }
  }


  async getHash(): Promise<string> {
    if (!this.account) throw new Error('Account not found')
    if (!this.contract) throw new Error('Contract not found');

    try {
      return await this.contract.methods.getHash().call();
    } catch (error) {
      console.error('Error getting hash from blockchain:', error);
      throw new Error('Error getting hash from blockchain');
    }
  }

  async getLength(): Promise<number> {
    if (!this.account) throw new Error('Account not found')
    if (!this.contract) throw new Error('Contract not found');

    try {
      return await this.contract.methods.getLength().call();
    } catch (error) {
      console.error('Error getting length from blockchain:', error);
      throw new Error('Error getting length from blockchain');
    }
  }

  async verifyDocument(index: number, hashToVerify: string): Promise<boolean> {
    if (!this.account) throw new Error('Account not found')
    if (!this.contract) throw new Error('Contract not found');

    try {
      return await this.contract.methods.verifyDocument(index, hashToVerify).call();
    } catch (error) {
      console.error('Error verifying document from blockchain:', error);
      throw new Error('Error verifying document from blockchain');
    }
  }
}
