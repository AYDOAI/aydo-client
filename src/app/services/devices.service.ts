import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, from, Observable, shareReplay, tap } from 'rxjs';
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
  constructor(private request: RequestService) {}

  private selectedDeviceSub = new BehaviorSubject<DeviceItem | null>(null);
  selectedDevice$ = this.selectedDeviceSub.asObservable();

  getSelectedDevice() {
    return this.selectedDeviceSub.getValue();
  }

  selectDevice(device: DeviceItem) {
    this.selectedDeviceSub.next(device);
  }

  devices$ = this.request.get<DeviceItem[]>(this.baseUrl).pipe(shareReplay(1));

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

  updateItem(changes: IDeviceSettings): Observable<any> {
    return this.request
      .post(
        `${this.baseUrl}/update`,
        { data: changes },
        {
          mainGroup: 'backend',
          method: 'gateway-update-device',
        }
      )
      .pipe(
        tap(() => {
          const device = this.selectedDeviceSub.getValue();
          if (device) {
            this.selectedDeviceSub.next({
              ...device,
              name: changes.device_name,
              zoneId: changes.zone_id,
              settings: device.settings?.map(setting => {
                if (!changes.settings) {
                  return setting;
                }
                Object.entries(changes.settings).map(([key, value]) => {
                  if (setting.key === key) {
                    setting.value = value;
                  }
                  return setting;
                });
              }),
            });
          }
        })
      );
  }
}
