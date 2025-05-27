import { Component, inject, OnInit } from '@angular/core';
import { FormBaseComponent } from '../../../components/form-base.component';
import { ConfirmationModalComponent } from '../../../elements/dialog/confirmation-modal/confirmation-modal.component';
import { DialogService } from '../../../services/dialog.service';
import { AppFormInputs } from '../../../shared/types';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-hub-edit',
  templateUrl: './hub-edit.component.html',
  styleUrl: './hub-edit.component.scss',
})
export class HubEditComponent extends FormBaseComponent implements OnInit {
  private dialog = inject(DialogService);
  private modalCtrl = inject(ModalController);

  public override ngOnInit() {
    super.ngOnInit();
    if (!this.ui.gateway) {
      this.navCtrl.navigateBack(['/devices']);
    }

    this.form.title = this.ui.gateway?.identifier || '';
    if (this.ui.gateway?.params.timezone_settings) {
      const items = this.ui.gateway.params?.timezone_settings
        ?.split('\n')
        ?.map(item => {
          return {
            title: item,
            id: item,
          };
        });
      this.form.inputs.push({
        key: 'timezone',
        title: 'Timezone',
        type: 'select',
        items,
        defaultValue: this.ui.gateway?.timezone,
      });
    }

    this.form.inputs.push({
      key: 'save_hub',
      title: 'Save',
      type: 'button',
    });

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
      case 'save_hub':
        this.saveHub();
        return;
      default:
        return;
    }
  }

  public saveHub(): void {
    this.backend.updateGateway(this.formGroup.value).subscribe(() => {
      this.errors.showInfo('Hub settings is successfully updated');
    });
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
        this.storage.serverId = '';
        this.storage.next();
        this.ui.gateway = null;
        if (this.isModal) {
          this.modalCtrl.dismiss();
        }
        this.navCtrl.navigateRoot('/add-hub');
      });
    }
  }
}
