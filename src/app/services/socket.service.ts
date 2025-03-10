import { Injectable, Injector } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { UIService } from './ui.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private ui!: UIService;
  constructor(
    private storage: StorageService,
    private user: UserService,
    private injector: Injector
  ) {}

  public connect(): void {
    this.socket = io(environment.main_url, {
      transports: ['websocket'],
      reconnectionDelay: 10000,
      reconnectionAttempts: 5,
    });
    this.ui = this.injector.get(UIService);
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
      this.ui.getGateway(() => {
        this.ui.getDevices();
      });
    });
    this.socket.on('update-capabilities', () => {
      this.ui.getDeviceValues();
    });
    this.socket.on('update-info', () => {
      this.user.reloadUser();
      this.ui.getUserRewards();
    });
  }
}
