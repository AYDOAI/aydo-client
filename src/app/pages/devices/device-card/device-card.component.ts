import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { DeviceItem } from '../../../models/gateway.model';
import { ZoneService } from '../../../services/zone.service';

@Component({
  selector: 'app-device-card',
  templateUrl: './device-card.component.html',
  styleUrl: './device-card.component.scss',
})
export class DeviceCardComponent {
  @Input() device!: DeviceItem;
  @Output() edit: EventEmitter<DeviceItem> = new EventEmitter<DeviceItem>();

  private zoneService = inject(ZoneService);

  public deviceCapabilitiesExists(device: DeviceItem): boolean {
    return !!device.capabilities.find(item => this.capabilityExists(item));
  }

  public capabilityExists(item: any): boolean {
    return (
      item.displayName !== 'Linkquality' &&
      item.value &&
      ['power', 'mode', 'motion', 'rgb'].indexOf(item.ident) === -1
    );
  }

  public zoneName(device: DeviceItem) {
    return this.zoneService.zones?.items?.find(
      item => String((item as any).id) === String(device.zoneId)
    )?.name;
  }
}
