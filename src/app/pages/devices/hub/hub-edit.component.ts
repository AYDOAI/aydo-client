import { Component, inject, OnInit } from '@angular/core';
import { FormBaseComponent } from '../../../components/form-base.component';
import { ConfirmationModalComponent } from '../../../elements/dialog/confirmation-modal/confirmation-modal.component';
import { DialogService } from '../../../services/dialog.service';
import { AppFormInputs } from '../../../shared/types';

@Component({
  selector: 'app-hub-edit',
  templateUrl: './hub-edit.component.html',
  styleUrl: './hub-edit.component.scss',
})
export class HubEditComponent extends FormBaseComponent implements OnInit {
  private dialog = inject(DialogService);

  public override ngOnInit() {
    super.ngOnInit();
    if (!this.ui.gateway) {
      this.navCtrl.navigateBack(['/devices']);
    }

    this.form.title = this.ui.gateway?.identifier || '';

    this.form.inputs.push({
      key: 'delete_hub',
      title: 'Delete hub',
      type: 'button',
      class: 'red-btn',
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(button: AppFormInputs): void {
    switch (button.key) {
      case 'delete_hub':
        this.deleteHub();
        return;
      default:
        return;
    }
  }

  public deleteHub(): void {
    this.dialog.show(ConfirmationModalComponent, {
      title: 'Confirmation',
      description: 'Are you sure you want to delete hub?',
      confirm: () => this.delete(),
    });
  }

  private delete(): void {
    const ident = this.ui.gateway?.identifier;
    if (ident) {
      this.backend.deleteGateway().subscribe(() => {
        this.errors.showInfo('Hub is successfully deleted');
        this.ui.stopDeviceValuesInterval();
        this.storage.serverId = '';
        this.ui.gateway = null;
        this.navCtrl.navigateRoot(['/devices']);
      });
    }
  }
}
