import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { WalletAdapter } from './wallet.adapter';

export class WalletSolflareService implements WalletAdapter {
  private wallet: SolflareWalletAdapter;
  private connection: Connection;

  public connected = false;
  private _publicKey: PublicKey | null = null;
  public name: string = 'Solflare Wallet';

  constructor(rpcUrl: string = 'https://api.mainnet-beta.solana.com') {
    this.wallet = new SolflareWalletAdapter();
    this.connection = new Connection(rpcUrl);

    this.wallet.on('connect', () => {
      this.connected = true;
      this._publicKey = this.wallet.publicKey ?? null;
      console.log('Solflare connected:', this._publicKey?.toString());
    });

    this.wallet.on('disconnect', () => {
      this.connected = false;
      this._publicKey = null;
      console.log('Solflare disconnected');
    });
  }

  async connect(): Promise<void> {
    try {
      if (!this.wallet) {
        throw new Error('Solflare wallet is not available');
      }

      await this.wallet.connect();
    } catch (error) {
      console.error('Error connecting to the wallet:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.wallet.disconnect();
    } catch (error) {
      console.error('Error disconnecting from the wallet:', error);
      throw error;
    }
  }

  get publicKey(): string | null {
    return this._publicKey?.toString() ?? null;
  }

  async signTransaction(transaction: Transaction): Promise<Transaction> {
    try {
      if (!this.wallet || !this.wallet.signTransaction) {
        throw new Error('Wallet does not support signing transactions');
      }

      return await this.wallet.signTransaction(transaction);
    } catch (error) {
      console.error('Error signing transaction:', error);
      throw error;
    }
  }
}
