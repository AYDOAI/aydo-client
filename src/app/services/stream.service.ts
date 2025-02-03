import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of, shareReplay, startWith, Subject, switchMap, take } from 'rxjs';
import { DeviceItem } from '../models/gateway.model';

export interface DataStream {
  id: number;
  name: string;
  description: string;
  externalLink: string;
  status?: 0 | 1;
  logo?: string;
  devices: DeviceItem[];
}

@Injectable({
  providedIn: 'root',
})
export class StreamService {
  private reloadSubject = new Subject<void>();
  private readonly httpClient = inject(HttpClient);

  baseUrl = `${environment.main_url}/backend/v2/data-stream`;

  streams$ = this.reloadSubject.pipe(
    startWith(undefined),
    switchMap(() => this.httpClient.get<DataStream[]>(this.baseUrl)),
    shareReplay(1)
  );

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
          return this.httpClient.get<DataStream>(`${this.baseUrl}/${id}`);
        }
      })
    );
  }

  disconnectDeviceFromStream(streamId: number, deviceId: number) {
    return this.httpClient.delete(
      `${this.baseUrl}/${streamId}/devices/${deviceId}`
    );
  }

  connectDeviceToStream(streamId: number, deviceId: number) {
    return this.httpClient.post(`${this.baseUrl}/${streamId}/devices`, {
      deviceId,
    });
  }

  toggleDataStream(streamId: number) {
    return this.httpClient.post(`${this.baseUrl}/${streamId}/toggle`, {});
  }
}
