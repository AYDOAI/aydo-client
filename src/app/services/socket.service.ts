import { Injectable, Injector } from '@angular/core';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { UIService } from './ui.service';
import { UserService } from './user.service';
import { io, Socket } from 'socket.io-client';
import { Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { ErrorsService } from './errors.service';
import { DevicesService } from './devices.service';
import { ZoneService } from './zone.service';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket!: Socket;
  private messageSubject = new Subject<any>();
  private destroy$ = new Subject<void>();
  private ui!: UIService;
  private devices!: DevicesService;
  private zones!: ZoneService;

  constructor(
    private storage: StorageService,
    private user: UserService,
    private errors: ErrorsService,
    private injector: Injector
  ) {}

  public connect(): void {
    this.socket = io(environment.main_url, {
      transports: ['websocket'],
      reconnectionDelay: 10000,
      reconnectionAttempts: 5,
    });

    this.socket.on('connect', () => {
      this.authenticate();
    });

    this.socket.onAny((event, data) => {
      this.messageSubject.next({ event, data });
    });
    this.ui = this.injector.get(UIService);
    this.devices = this.injector.get(DevicesService);
    this.zones = this.injector.get(ZoneService);
    this.subscribeToMessages();
  }

  public disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  private authenticate(): void {
    const data = { token: this.storage.token };
    this.send('authenticate', data);
  }

  send(method: string, data: any = null): void {
    if (this.socket) {
      this.socket.emit(method, data);
    }
  }

  on<T>(event: string): Observable<T> {
    return this.messageSubject.pipe(
      filter(message => message.event === event),
      map(message => message.data),
      takeUntil(this.destroy$)
    );
  }

  private subscribeToMessages(): void {
    this.on('register-devices')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ui.getGateway(() => {
          this.ui.getDevices();
        });
        this.devices.refreshDevices();
      });

    this.on('update-capabilities')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ui.getDeviceValues().subscribe();
      });

    this.on('update-info')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.user.reloadUser();
        this.ui.getUserRewards();
      });

    this.on('update-zones')
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.zones.forceUpdate$.next(true);
      });

    this.on<{ message: string }>('notification')
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: { message: string }) => {
        if (data.message) {
          this.errors.showNotify(data.message);
        }
      });
  }
}
