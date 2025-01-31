import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { DialogContainerComponent } from './dialog-container/dialog-container.component';
import { FullPageModalComponent } from './full-page-modal/full-page-modal.component';
import { LicenseDialogComponent } from './license-dialog/license-dialog.component';
import { ConfirmationModalComponent } from './confirmation-modal/confirmation-modal.component';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    DialogContainerComponent,
    FullPageModalComponent,
    LicenseDialogComponent,
    ConfirmationModalComponent,
  ],
  imports: [ReactiveFormsModule, CommonModule, IonicModule],
  exports: [
    DialogContainerComponent,
    FullPageModalComponent,
    LicenseDialogComponent,
    ConfirmationModalComponent,
  ],
})
export class DialogModule {}
