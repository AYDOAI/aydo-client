import { Component, EventEmitter, Output } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';

@Component({
  selector: 'app-gateway-card',
  templateUrl: './gateway-card.component.html',
  styleUrl: './gateway-card.component.scss',
})
export class GatewayCardComponent extends BaseComponent {
  @Output() edit: EventEmitter<void> = new EventEmitter<void>();
}
