export interface WalletAdapter {
  connected: boolean;
  publicKey: string | null;
  name: string;

  connect(): Promise<void>;
  disconnect(): Promise<void>;

  getStreamerAccountKey(): string | null;
  getStreamerAccount(): Promise<any>;
  getStreamerTokenAccount(): Promise<any>;
  createStreamerAccount(): Promise<void>;
}
