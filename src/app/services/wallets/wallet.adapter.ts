export interface WalletAdapter {
  connected: boolean;
  publicKey: string | null;
  name: string;

  connect(): Promise<void>;
  disconnect(): Promise<void>;
}
