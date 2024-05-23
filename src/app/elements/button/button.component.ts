import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {

  @Input() width = '100%';
  @Input() height = '54px';
  @Input() color = 'black';
  @Input() backgroundColor = '';
  @Input() title = '';
  @Input() arrow = true;
  @Input() border = true;
  @Input() icon = '';
  @Output() onClick: EventEmitter<any> = new EventEmitter<any>();

  click() {
    this.onClick.emit();
  }

}
