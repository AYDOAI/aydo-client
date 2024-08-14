import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
	selector: 'app-full-page',
	templateUrl: './full-page-modal.component.html',
	styleUrls: ['./full-page-modal.component.scss'],
})
export class FullPageModalComponent {
	@Input() public headerTitle: string = '';
	@Output() public back: EventEmitter<any> = new EventEmitter<any>();
}
