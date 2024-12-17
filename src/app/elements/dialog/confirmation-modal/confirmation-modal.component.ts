import { Component } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { BaseDialogComponent } from '../base-dialog';

@Component({
	selector: 'app-confirmation-modal',
	templateUrl: './confirmation-modal.component.html',
	styleUrls: ['./confirmation-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ConfirmationModalComponent extends BaseDialogComponent  {
	public title: string = '';
  public description: string = '';
  public okText: string = 'Ok';
  public cancelText: string = 'Cancel';

  public confirm!: () => void;

  public ok(): void {
    this.close();
    this.confirm();
  }
}
