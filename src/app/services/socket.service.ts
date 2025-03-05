import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  public updateDevices$ = new Subject<void>();
  public updateDeviceValues$ = new Subject<void>();
  private socket!: Socket;
  constructor(private storage: StorageService) {}

  public connect(): void {
    this.socket = io(environment.main_url, {
      transports: ['websocket'],
      reconnectionDelay: 10000,
      reconnectionAttempts: 5,
    });

    this.subscribeToMessages();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  authenticate() {
    const data: any = { token: this.storage.token };
    this.send('authenticate', data);
  }

  send(method: string, data = null) {
    if (!this.socket) {
      return;
    }
    this.socket.emit(method, data);
  }

  subscribeToMessages(): void {
    this.socket.on('connect', () => {
      this.authenticate();
    });
    this.socket.on('register-devices', () => {
      this.updateDevices$.next();
    });
    this.socket.on('update-capabilities', () => {
      this.updateDeviceValues$.next();
    });
  }
}
