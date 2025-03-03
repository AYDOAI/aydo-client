import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { of, shareReplay, startWith, Subject, switchMap, take } from 'rxjs';
import { RequestService } from './request.service';

export interface DataStream {
  smartContract: any;
  id: number;
  name: string;
  keyword: string;
  description: string;
  externalLink: string;
  status?: 0 | 1;
  logo?: string;
  devices?: {
    id: number;
    deviceId: number;
    dataStreamId: number;
    createdAt: Date;
  }[];
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

  constructor(private request: RequestService) {}

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
    return this.request.del(`${this.baseUrl}/${streamId}/devices/${deviceId}`);
  }

  connectDeviceToStream(streamId: number, deviceId: number) {
    return this.request.post(`${this.baseUrl}/${streamId}/devices`, {
      deviceId,
    });
  }

  toggleDataStream(streamId: number) {
    return this.request.post(`${this.baseUrl}/${streamId}/toggle`, {});
  }
}
