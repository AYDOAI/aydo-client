import {Component, Input} from '@angular/core';

@Component({
  selector: 'svg-icon',
  templateUrl: './svg-icon.component.html',
  styleUrls: ['./svg-icon.component.scss']
})
export class SvgIconComponent {

  @Input() name!: string;
  @Input() color!: string;
  @Input() stroke!: string;
  @Input() width!: string;
  @Input() height: string = '16px';
  @Input() marginLeft!: number;

  get absUrl() {
    return window.location.href;
  }

}
