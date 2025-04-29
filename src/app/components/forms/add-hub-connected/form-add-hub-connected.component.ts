import { Component, inject } from '@angular/core';
import { FormBaseComponent } from '../../form-base.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-form-add-hub-connected',
  templateUrl: './form-add-hub-connected.component.html',
  styleUrl: './form-add-hub-connected.component.scss',
})
export class FormAddHubConnectedComponent extends FormBaseComponent {
  private modalCtrl = inject(ModalController);
  override onInit() {
    this.form.title = 'Add hub';
    this.form.description = 'AYDO Hub connected';
    this.form.inputs.push({
      key: 'btn',
      title: 'Go to devices',
      type: 'button',
      icon: 'arrow-right',
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(): void {
    this.ui.getGateway();
    if (this.isModal) {
      this.modalCtrl.dismiss();
    }
    this.navCtrl.navigateForward('/devices');
  }
}
