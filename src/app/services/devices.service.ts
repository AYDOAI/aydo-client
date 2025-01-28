import { inject, Injectable } from '@angular/core';
import { from, Observable, shareReplay } from 'rxjs';
import { RequestService } from './request.service';
import { BaseService } from '../models/base-service.interface';
import { IDeviceSettings } from '../shared/interfaces/device-settings.interface';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { DeviceItem } from '../models/gateway.model';

@Injectable({
  providedIn: 'root',
})
export class DevicesService implements BaseService<any> {
  private readonly httpClient = inject(HttpClient);
  constructor(private request: RequestService) {}

  devices$ = this.httpClient
    .get<DeviceItem[]>(this.baseUrl)
    .pipe(shareReplay(1));

  get baseUrl(): string {
    return `${environment.main_url}/backend/v2/gateway/device`;
  }

  // TODO: refactor request service, return observables
  getItems(): Observable<any[]> {
    return this.request.get(this.baseUrl, {
      mainGroup: 'backend',
      method: 'gateway-get-devices',
    });
  }

  deleteItem(device_ident: string): Observable<any> {
    return this.request.post(
      `${this.baseUrl}/delete`,
      { data: { device_ident } },
      {
        mainGroup: 'backend',
        method: 'gateway-delete-device',
      }
    );
  }

  updateItem(device: IDeviceSettings): Observable<any> {
    return this.request.post(
      `${this.baseUrl}/update`,
      { data: device },
      {
        mainGroup: 'backend',
        method: 'gateway-update-device',
      }
    );
  }
}
