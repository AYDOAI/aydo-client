import { AnchorProvider, Program, setProvider } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
} from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import type { Aydo } from './smart-contract/aydo';
import idl from './smart-contract/aydo.json';
import { WalletAdapter } from './wallet.adapter';

export class WalletSolflareService implements WalletAdapter {
  private wallet: SolflareWalletAdapter;
  private mint: PublicKey;
  private program: any;
  private tokenProgramId = TOKEN_2022_PROGRAM_ID;

  public streamerAydoAccountKey: any;
  public streamerTokenAccountKey: any;

  public connected = false;
  private _publicKey: PublicKey | null = null;
  public name: string = 'Solflare Wallet';

  constructor(rpcUrl: string = 'https://api.devnet.solana.com') {
    this.wallet = new SolflareWalletAdapter();
    this.mint = new PublicKey('AYMuaTVib2XrPwStrWaVW7k2yeZmDVRc61SFvDjJTwF3');

    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    this.program = new Program(idl as Aydo, {
      connection,
    });

    this.wallet.on('connect', () => {
      this.connected = true;
      this._publicKey = this.wallet.publicKey ?? null;
      console.log('Solflare connected:', this._publicKey?.toString());

      this.streamerAydoAccountKey = this.getStreamerAccountKey();
      this.streamerTokenAccountKey = this.getStreamerTokenAccountKey();
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

  getStreamerAccountKey(): string | null {
    if (this.connected && this._publicKey) {
      const [result, bump] = PublicKey.findProgramAddressSync(
        [Buffer.from('streamer'), this._publicKey.toBuffer()],
        this.program.programId
      );

      console.log(`Streamer Account: ${result.toBase58()}`);
      return String(result);
    }

    return null;
  }

  getStreamerTokenAccountKey(): string | null {
    if (this.connected && this._publicKey && this.streamerAydoAccountKey) {
      const result = getAssociatedTokenAddressSync(
        this.mint,
        new PublicKey(this.streamerAydoAccountKey),
        true,
        this.tokenProgramId
      );
      console.log(`Streamer Token Account: ${result.toBase58()}`);
      return String(result);
    }

    return null;
  }

  async getStreamerAccount(): Promise<any> {
    if (this.connected && this._publicKey && this.streamerAydoAccountKey) {
      const accountInfo = await this.program.provider.connection.getAccountInfo(
        new PublicKey(this.streamerAydoAccountKey)
      );
      if (accountInfo) {
        const data = await this.program.account.streamer.fetch(
          new PublicKey(this.streamerAydoAccountKey)
        );
        console.log('Streamer Account Data:', data);
        return data;
      }
    }

    return null;
  }

  async getStreamerTokenAccount(): Promise<any> {
    if (this.connected && this._publicKey && this.streamerTokenAccountKey) {
      const streamerAydoAccountKey = new PublicKey(this.streamerAydoAccountKey);
      const streamerTokenAccountKey = new PublicKey(
        this.streamerTokenAccountKey
      );
      const accountInfo = await this.program.provider.connection.getAccountInfo(
        streamerTokenAccountKey
      );
      if (accountInfo) {
        const data =
          await this.program.provider.connection.getTokenAccountBalance(
            streamerTokenAccountKey
          );
        console.log('Streamer Token Account Data:', data);
        return data;
      }
    }

    return null;
  }

  async createStreamerAccount(): Promise<any> {
    if (this.connected && this._publicKey && this.wallet.publicKey) {
      const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
      const transaction = new Transaction();

      if (this.streamerAydoAccountKey) {
        const streamerAydoAccountKey = new PublicKey(
          this.streamerAydoAccountKey
        );
        const checkStreamerAccount =
          await this.program.provider.connection.getAccountInfo(
            streamerAydoAccountKey
          );
        if (!checkStreamerAccount) {
          console.log('Add transaction for create streamer account...');

          transaction.add(
            await this.program.methods
              .createStreamer()
              .accounts({
                streamer: streamerAydoAccountKey,
                owner: this.wallet.publicKey,
                systemProgram: SystemProgram.programId,
              })
              .instruction()
          );
        }
      }

      if (this.streamerTokenAccountKey) {
        const streamerAydoAccountKey = new PublicKey(
          this.streamerAydoAccountKey
        );
        const streamerTokenAccountKey = new PublicKey(
          this.streamerTokenAccountKey
        );
        const checkStreamerTokenAccount =
          await this.program.provider.connection.getAccountInfo(
            streamerTokenAccountKey
          );
        if (!checkStreamerTokenAccount) {
          console.log('Add transaction for create streamer token account...');
          transaction.add(
            await createAssociatedTokenAccountInstruction(
              this.wallet.publicKey,
              streamerTokenAccountKey,
              streamerAydoAccountKey,
              this.mint,
              this.tokenProgramId
            )
          );
        }
      }

      transaction.feePayer = this.wallet.publicKey;
      transaction.recentBlockhash = (
        await connection.getLatestBlockhash()
      ).blockhash;

      const txId = await this.wallet.sendTransaction(transaction, connection);
      console.log('Transaction sent:', txId);

      const latestBlockhash = await connection.getLatestBlockhash();
      await connection.confirmTransaction(
        {
          signature: txId,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      );

      console.log('Transaction confirmed:', txId);
    }
  }
}

function useAnchorWallet() {
  throw new Error('Function not implemented.');
}
