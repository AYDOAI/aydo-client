import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BaseDialogComponent } from '../base-dialog';

@Component({
	selector: 'app-license-dialog',
	templateUrl: './license-dialog.component.html',
	styleUrls: ['./license-dialog.component.scss'],
})
export class LicenseDialogComponent extends BaseDialogComponent {
	@Input() public headerTitle: string = '';
	@Output() public back: EventEmitter<any> = new EventEmitter<any>();
}
