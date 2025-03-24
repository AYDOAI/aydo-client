import { WalletSolflareService } from './wallets/solflare.service';
import { WalletAdapter } from './wallets/wallet.adapter';

export class WalletService {
  private wallet: WalletAdapter | undefined;

  constructor(walletType: 'solana') {
    this.wallet = this.createWallet(walletType);
  }

  private createWallet(type: string): WalletAdapter | undefined {
    switch (type) {
      case 'solana':
        return new WalletSolflareService();
      default:
        console.error('Unsupported wallet type:', type);
        return undefined;
    }
  }

  async connect(): Promise<void> {
    if (!this.wallet) {
      throw new Error('No wallet selected');
    }

    await this.wallet.connect();
  }

  async disconnect(): Promise<void> {
    if (!this.wallet) return;

    await this.wallet.disconnect();
  }

  get connected(): boolean {
    return this.wallet?.connected ?? false;
  }

  get publicKey(): string | null {
    return this.wallet?.publicKey ?? null;
  }

  get name(): string | null {
    return this.wallet?.name ?? null;
  }

  getStreamerAccountKey(): string | null {
    if (!this.wallet) {
      throw new Error('No wallet selected');
    }

    return this.wallet.getStreamerAccountKey();
  }

  async getStreamerAccount(): Promise<any> {
    if (!this.wallet) {
      throw new Error('No wallet selected');
    }

    return this.wallet.getStreamerAccount();
  }

  async getStreamerTokenAccount(): Promise<any> {
    if (!this.wallet) {
      throw new Error('No wallet selected');
    }

    return this.wallet.getStreamerTokenAccount();
  }

  async createStreamerAccount(): Promise<any> {
    if (!this.wallet) {
      throw new Error('No wallet selected');
    }

    return this.wallet.createStreamerAccount();
  }
}
