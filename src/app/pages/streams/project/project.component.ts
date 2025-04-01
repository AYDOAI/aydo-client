import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { DataStream } from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, finalize, map, switchMap } from 'rxjs';
import { StreamService } from '../../../services/stream.service';
import { ClipboardService } from '../../../services/clipboard.service';
import { WalletService } from '../../../services/wallet.service';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent extends BaseComponent implements ViewWillEnter {
  private route = inject(ActivatedRoute);
  private streamService = inject(StreamService);
  private clipboard = inject(ClipboardService);

  private walletService: WalletService | undefined;

  isConnected = false;
  isStreamingActive: boolean = false;
  publicKey: string | null = null;
  streamerAccount: any | null = undefined;
  streamerTokenAccount: any | null = undefined;

  private streamSubject = new BehaviorSubject<DataStream | null>(null);
  public stream$: Observable<DataStream | null> =
    this.streamSubject.asObservable();

  ionViewWillEnter() {
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => this.streamService.getStreamById(id))
      )
      .subscribe({
        next: dataStream => {
          this.streamSubject.next(dataStream);
          this.isStreamingActive = this.checkStreamingActive(dataStream);
          if (dataStream.smartContract) {
            this.walletService = new WalletService(
              dataStream.smartContract.blockchain.keyword
            );
          }
        },
      });
  }

  public copyLink(text: string, event: MouseEvent | TouchEvent): void {
    this.clipboard.copy(text, event);
  }

  public toggle(): void {
    this.ui.lockBtn('streaming');

    const currentStream = this.streamSubject.getValue();
    if (!currentStream) {
      this.ui.unlockBtn('streaming');
      return;
    }

    this.streamService
      .toggleDataStream(currentStream.id)
      .pipe(finalize(() => this.ui.unlockBtn('streaming')))
      .subscribe({
        next: ({ status }) => {
          const oldValue = this.streamSubject.getValue();
          if (oldValue) {
            const dataStream = {
              ...oldValue,
              status,
            };
            this.isStreamingActive = this.checkStreamingActive(dataStream);
            this.streamSubject.next(dataStream);
          }
        },
      });
  }

  async connectWallet(): Promise<void> {
    if (this.walletService) {
      await this.walletService.connect();
      this.isConnected = this.walletService.connected;
      this.publicKey = this.walletService.publicKey?.toString() || null;

      if (this.isConnected) {
        this.streamerAccount = await this.walletService.getStreamerAccount();
        this.streamerTokenAccount =
          await this.walletService.getStreamerTokenAccount();
      }
    }
  }

  async disconnectWallet(): Promise<void> {
    if (this.walletService) {
      await this.walletService.disconnect();
      this.isConnected = this.walletService.connected;
      this.publicKey = null;
    }
  }

  async createStreamerAccount(): Promise<void> {
    if (this.walletService) {
      await this.walletService.createStreamerAccount();
    }
  }

  getWalletName(): string | null {
    if (this.walletService) {
      return this.walletService.name;
    }

    return null;
  }

  checkStreamingActive(dataStream: any): boolean {
    return dataStream?.status === 1 && dataStream.devices?.length > 0;
  }
}
