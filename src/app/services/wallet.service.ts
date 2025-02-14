import { WalletSolflareService } from './wallets/solflare.service';

export class WalletService {
  private wallet: WalletSolflareService | undefined;

  public connected = false;
  public publicKey: string | null = null;

  constructor(type: string) {
    if (type == 'solana') {
      this.wallet = new WalletSolflareService();
    }
  }

  async connect(): Promise<void> {
    if (this.wallet) {
      await this.wallet.connect();
      this.connected = this.wallet.connected;
      this.publicKey = this.wallet.publicKey;
    }
  }

  async disconnect(): Promise<void> {
    if (this.wallet) {
      await this.wallet.disconnect();
      this.connected = false;
      this.publicKey = null;
    }
  }

  getName(): string | null {
    if (this.wallet) {
      return this.wallet.name;
    }

    return null;
  }
}
