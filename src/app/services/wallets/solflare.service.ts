import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { Connection, PublicKey } from '@solana/web3.js';

export class WalletSolflareService {
  private wallet: SolflareWalletAdapter;
  private connection: Connection;

  public connected = false;
  public publicKey: string | null = null;

  public name: string = 'Solflare Wallet';

  constructor() {
    this.wallet = new SolflareWalletAdapter();
    this.connection = new Connection('https://api.mainnet-beta.solana.com');
  }

  async connect(): Promise<void> {
    try {
      await this.wallet.connect();
      this.connected = this.wallet.connected;
      this.publicKey = String(this.wallet.publicKey);
      console.log('Wallet connected:', this.publicKey?.toString());
    } catch (error) {
      console.error('Error connecting to the wallet:', error);
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.wallet.disconnect();
      this.connected = false;
      this.publicKey = null;
      console.log('Wallet disconnected');
    } catch (error) {
      console.error('Error disconnecting from the wallet:', error);
    }
  }
}
