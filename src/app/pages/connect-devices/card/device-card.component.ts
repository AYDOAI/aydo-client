import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBaseComponent } from '../../../components/form-base.component';
import { InputComponent } from '../../../elements/input/input.component';
import { DeviceItem } from '../../../models/gateway.model';

@Component({
  selector: 'app-connect-card',
  templateUrl: './device-card.component.html',
  standalone: true,
  imports: [],
  styleUrl: './device-card.component.scss',
})
export class ConnectDeviceCardComponent {
  @Input() device!: DeviceItem;

  @Output()
  toggleConnect: EventEmitter<void> = new EventEmitter();
}
