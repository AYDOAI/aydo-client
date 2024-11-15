import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { FullPageModalComponent } from './full-page-modal/full-page-modal.component';
import { LicenseDialogComponent } from './license-dialog/license-dialog.component';

@NgModule({
	declarations: [
		DialogContainerComponent,
		FullPageModalComponent,
    LicenseDialogComponent
	],
	imports: [ReactiveFormsModule, CommonModule],
	exports: [
		DialogContainerComponent,
		FullPageModalComponent,
    LicenseDialogComponent
	],
})
export class DialogModule {}
