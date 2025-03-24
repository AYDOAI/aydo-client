import { Injectable } from '@angular/core';
import {
  Observable,
  of,
  shareReplay,
  startWith,
  Subject,
  switchMap,
  take,
} from 'rxjs';
import { WsRequestService } from './ws-request.service';

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

  baseUrl = `/backend/v2/data-stream`;

  streams$ = this.reloadSubject.pipe(
    startWith(undefined),
    switchMap(() => this.request.get<DataStream[]>(this.baseUrl)),
    shareReplay(1)
  );

  constructor(private request: WsRequestService) {}

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
}
