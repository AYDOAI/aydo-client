import { Injectable } from '@angular/core';
import {
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import { WsRequestService } from './ws-request.service';
import { SmartContract } from './backend.service';
import { DevicesModel } from '../models/gateway.model';
import { ErrorsService } from './errors.service';

export interface DataStream {
  id: number;
  name: string;
  keyword: string;
  description: string;
  externalLink: string;
  status?: 0 | 1;
  logo?: string;
  invitationMode?: boolean;
  devices?: {
    id: number;
    deviceId: number;
    dataStreamId: number;
    createdAt: Date;
  }[];
  smartContract?: SmartContract;
  requiredPluginClassName?: string;
  supportedPluginClassNames?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private reloadSubject = new Subject<void>();

  private pendingStreamId: number | null = null;
  private pendingDriverId: number | null = null;

  baseUrl = `/backend/v2/data-stream`;

  streams$ = this.reloadSubject.pipe(
    startWith(undefined),
    switchMap(() => this.request.get<DataStream[]>(this.baseUrl)),
    shareReplay(1)
  );

  constructor(
    private request: WsRequestService,
    private errors: ErrorsService
  ) {}

  reloadData(): void {
    this.reloadSubject.next();
  }

  getStreamById(id: number) {
    return this.streams$.pipe(
      take(1),
      switchMap(streams => {
        const stream = streams.find(s => s.id === id);
        if (stream) {
          return of(stream);
        } else {
          return this.request.get<DataStream>(`${this.baseUrl}/${id}`);
        }
      })
    );
  }

  getStreamByKeyword(keyword: string) {
    return this.streams$.pipe(
      take(1),
      switchMap(streams => {
        const stream = streams.find(s => s.keyword === keyword);
        if (stream) {
          return of(stream);
        } else {
          return this.request.get<DataStream>(
            `${this.baseUrl}/keyword/${keyword}`
          );
        }
      })
    );
  }

  disconnectDeviceFromStream(streamId: number, deviceId: number) {
    return this.request.delete(
      `${this.baseUrl}/${streamId}/devices/${deviceId}`
    );
  }

  connectDeviceToStream(streamId: number, deviceId: number) {
    return this.request.post(`${this.baseUrl}/${streamId}/devices`, {
      deviceId,
    });
  }

  toggleDataStream(streamId: number): Observable<any> {
    return this.request.post(`${this.baseUrl}/${streamId}/toggle`, {});
  }

  waitForPlugin(stream: DataStream, driverId: number): void {
    this.pendingStreamId = stream.id;
    this.pendingDriverId = driverId;
  }

  checkPendingStream(devices: DevicesModel): void {
    if (!this.pendingStreamId || !this.pendingDriverId) return;

    const device = devices?.items?.find(
      d => d.driverId === this.pendingDriverId
    );
    if (!device) return;

    this.getStreamById(this.pendingStreamId)
      .pipe(
        switchMap(stream => {
          if (!stream) throw new Error('stream not found');
          return this.connectDeviceToStream(stream.id, device.id).pipe(
            switchMap(() => this.toggleDataStream(stream.id)),
            map(() => stream)
          );
        })
      )
      .subscribe({
        next: stream => {
          this.errors.showInfo(`Project ${stream.name} started`);
          this.pendingStreamId = null;
          this.pendingDriverId = null;
        },
        error: () => {
          this.pendingStreamId = null;
          this.pendingDriverId = null;
        },
      });
  }
}
