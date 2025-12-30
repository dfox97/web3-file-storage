import { Injectable, inject } from '@angular/core';
import { Web3Service } from './web3-connection.service';

export interface DocumentInfo {
  cid: string;
  name: string;
  timestamp: number;
}

export interface IIPFSContract {
  addDocument: (cid: string, name: string) => Promise<void>;
  getDocument: (user: string, index: number) => Promise<DocumentInfo>;
  getDocumentCount: (user: string) => Promise<number>;
}

@Injectable({ providedIn: 'root' })
export class EthDocUploaderService {
  #web3Service = inject(Web3Service);

  public get account() {
    return this.#web3Service.account;
  }

  private get contract() {
    return this.#web3Service.contract;
  }

  async addDocument(cid: string, name: string): Promise<void> {
    if (!this.account) throw new Error('Account not found');
    if (!this.contract) throw new Error('Contract not found');

    try {
      await this.contract.methods
      ['addDocument'](cid, name)
        .send({ from: this.account, gas: '300000' });
    } catch (e) {
      console.error('Error storing document:', e);
      throw new Error('Error storing document');
    }
  }

  async getUserDocumentCount(user: string): Promise<number> {
    if (!this.contract) throw new Error('Contract not found');
    try {
      return await this.contract.methods['getDocumentCount'](user).call();
    } catch (e) {
      console.error('Error reading document count:', e);
      throw new Error('Error reading document count');
    }
  }

  async getUserDocument(user: string | undefined, index: number): Promise<DocumentInfo> {
    if (!this.contract) throw new Error('Contract not found');
    if (!user) throw new Error('User address is undefined');

    try {
      const result = await this.contract.methods['getDocument'](user, index).call();
      return {
        cid: result[0],
        name: result[1],
        timestamp: Number(result[2])
      };
    } catch (e) {
      console.error('Error fetching document:', e);
      throw new Error('Error fetching document');
    }
  }
}
