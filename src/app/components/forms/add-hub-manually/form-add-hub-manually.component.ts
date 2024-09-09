import {Component, inject, Input} from '@angular/core';
import {FormBaseComponent} from '../../form-base.component';
import {ActivatedRoute} from '@angular/router';
import { AppFormInputs } from "../../../shared/types";
import { DialogService } from "../../../services/dialog.service";
import { BarcodeScannerComponent } from "../../../elements/barcode-scanner/barcode-scanner.component";

@Component({
  selector: 'app-form-add-hub-manually',
  templateUrl: './form-add-hub-manually.component.html',
  styleUrl: './form-add-hub-manually.component.scss'
})
export class FormAddHubManuallyComponent extends FormBaseComponent {

  @Input() description = '';

  private activatedRoute = inject(ActivatedRoute);
  private dialogService = inject(DialogService);

  override onInit() {
    this.form.title = 'Add hub';
    this.form.description = this.description;
    this.form.inputs = [];
    this.form.inputs.push({
      key: 'identifier',
      title: 'Identificator',
      type: 'input',
      required: true
    });
    this.form.inputs.push({
      key: 'token',
      title: 'Token',
      type: 'input',
      required: true
    });
    this.form.inputs.push({
      key: 'attach',
      title: 'Sign in',
      type: 'button',
      icon: 'arrow-right'
    });
    this.form.inputs.push({
      key: 'scan',
      title: 'Scan QR Code',
      type: 'button',
      icon: 'arrow-right'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(button: AppFormInputs): void {
    switch (button.key) {
      case 'scan':
        this.dialogService.show(BarcodeScannerComponent, {

        });
        return;
      case 'attach':
        const gateway = {...this.formGroup.value};
        this.resetFormErrors();
        this.backend.gatewayConnect(gateway).then((data: any) => {
          if (data && data.gateway && data.gateway.identifier) {
            this.storage.serverId = data.gateway.identifier;
            this.ui.goStep('devices');
          }
        }).catch(() => {

        });
    }
    const hub = this.activatedRoute.snapshot.paramMap.get('hub');
    this.router.navigate([`add-hub/${hub}/connected`]);
  }

}
