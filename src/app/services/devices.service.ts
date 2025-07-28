import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { BaseService } from '../models/base-service.interface';
import { IDeviceSettings } from '../shared/interfaces/device-settings.interface';
import { DeviceItem } from '../models/gateway.model';
import { WsRequestService } from './ws-request.service';
@Injectable({
  providedIn: 'root',
})
export class DevicesService implements BaseService<any> {
  constructor(private request: WsRequestService) {}

  private selectedDeviceSub = new BehaviorSubject<DeviceItem | null>(null);
  selectedDevice$ = this.selectedDeviceSub.asObservable();

  getSelectedDevice() {
    return this.selectedDeviceSub.getValue();
  }

  selectDevice(device: DeviceItem) {
    this.selectedDeviceSub.next(device);
  }

  private devicesSub = new BehaviorSubject<DeviceItem[]>([]);
  devices$ = this.devicesSub.asObservable();

  get baseUrl(): string {
    return `/backend/v2/gateway/device`;
  }

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

  refreshDevices() {
    this.request.get<DeviceItem[]>(this.baseUrl).subscribe(
      devices => {
        this.devicesSub.next(devices);
      },
      error => {
        console.error(error);
      }
    );
  }

  verifyDevice(deviceIdent: string, { photoId }: { photoId: string }) {
    return this.request.post(`${this.baseUrl}/verify/${deviceIdent}`, {
      photoId,
    });
  }
}
