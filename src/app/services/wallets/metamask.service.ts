import { getAccount } from '@wagmi/core';
import { WalletAdapter } from './wallet.adapter';
import { config, MetaMaskService } from '../metamask.service';

export class WalletMetamaskService implements WalletAdapter {
  public connected = false;
  public name = 'MetaMask Wallet';

  private _publicKey: string | null = null;

  get publicKey(): string | null {
    return this._publicKey;
  }

  constructor(private metamask: MetaMaskService) {}

  getStreamerAccountKey(): string | null {
    return null;
  }

  getStreamerTokenAccountKey(): string | null {
    return null;
  }

  async connect(): Promise<void> {
    try {
      await this.metamask.signInWithMetaMask({ linkOnly: true }).toPromise();
      const account = getAccount(config);
      this._publicKey = account.address ?? null;
      this.connected = !!this._publicKey;
      console.log(this._publicKey);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    this._publicKey = null;
    this.connected = false;
  }

  async getStreamerAccount(): Promise<any> {
    throw new Error('Not implemented');
  }

  async getStreamerTokenAccount(): Promise<any> {
    throw new Error('Not implemented');
  }

  async createStreamerAccount(): Promise<void> {
    throw new Error('Not implemented');
  }
}
