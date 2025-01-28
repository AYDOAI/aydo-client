import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable, shareReplay} from "rxjs";
import {DeviceItem} from "../models/gateway.model";

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
  providedIn: 'root'
})
export class StreamService {
  private readonly httpClient = inject(HttpClient);

  baseUrl = `${environment.main_url}/backend/v2/data-stream`;

  streams$ =
    this.httpClient.get<DataStream[]>(this.baseUrl).pipe(
      shareReplay(1)
    );

  getStreamById(id: number) {
    return this.httpClient.get<DataStream>(`${this.baseUrl}/${id}`);
  }

  disconnectDeviceFromStream(streamId: number, deviceId: number) {
    return this.httpClient.delete(`${this.baseUrl}/${streamId}/devices/${deviceId}`);
  }

  connectDeviceToStream(streamId: number, deviceId: number) {
    return this.httpClient.post(`${this.baseUrl}/${streamId}/devices`, { deviceId });
  }
}
