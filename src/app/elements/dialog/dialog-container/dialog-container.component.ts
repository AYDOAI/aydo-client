import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';

@Component({
	selector: 'app-dialog-container',
	template: '<div #dialogContainer></div>',
})
export class DialogContainerComponent implements OnInit {
	@ViewChild('dialogContainer', { static: true, read: ViewContainerRef })
	public viewContainerRef: ViewContainerRef = {} as ViewContainerRef;

	constructor(private dialogService: DialogService) {}

	public ngOnInit(): void {
		this.dialogService.registerViewContainerRef(this.viewContainerRef);
	}
}
