import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { BaseComponent } from '../../components/base.component';
import { DevicesService } from '../../services/devices.service';
import { ActivatedRoute } from '@angular/router';
import { StreamService } from '../../services/stream.service';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';

@Component({
  selector: 'app-connect-devices',
  templateUrl: './connect-devices.component.html',
  styleUrl: './connect-devices.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConnectDevicesComponent extends BaseComponent implements OnInit {
  private devicesService = inject(DevicesService);
  private streamService = inject(StreamService);

  private route = inject(ActivatedRoute);

  devices$ = this.devicesService.devices$;

  private streamSubject = new BehaviorSubject<any | null>(null);
  stream$ = this.streamSubject.asObservable();

  modalMatch = this.router.url.match(/\(modal:stream\/(\d+)\/devices\)/);

  streamId$: Observable<number> = this.modalMatch
    ? of(+this.modalMatch[1])
    : this.route.params.pipe(
        map(params => +params['id']),
        filter(id => !isNaN(id) && id > 0)
      );

  override ngOnInit() {
    super.ngOnInit();

    this.streamId$
      .pipe(switchMap(id => this.streamService.getStreamById(id)))
      .subscribe({
        next: stream => this.streamSubject.next(stream),
      });
  }

  mergedDevices$ = combineLatest([this.devices$, this.stream$]).pipe(
    map(([allDevices, stream]) => {
      if (!stream) {
        return [];
      }
      return allDevices
        .filter(device => {
          const supportedPlugins = stream.supportedPluginClassNames;
          const pluginMatch =
            !supportedPlugins ||
            supportedPlugins.some((plugin: string) =>
              device.ident.includes(plugin)
            );
          return pluginMatch && !device.setupRequired;
        })
        .map(device => ({
          ...device,
          connected: stream.devices?.some((d: any) => d.deviceId === device.id),
        }));
    })
  );

  onToggleConnection(deviceId: number, isConnected: boolean) {
    const currentStream = this.streamSubject.getValue();
    if (!currentStream) {
      return;
    }
    const update$ = isConnected
      ? this.streamService.disconnectDeviceFromStream(
          currentStream.id,
          deviceId
        )
      : this.streamService.connectDeviceToStream(currentStream.id, deviceId);

    update$.subscribe({
      next: updatedDevice => {
        const updatedDevices = isConnected
          ? currentStream.devices.filter((d: any) => d.deviceId !== deviceId)
          : [...currentStream.devices, updatedDevice];

        this.streamSubject.next({
          ...currentStream,
          devices: updatedDevices,
        });

        this.streamService.reloadData();
      },
    });
  }
}
