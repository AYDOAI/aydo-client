import { Component, inject, Input, NgZone } from '@angular/core';
import { FormBaseComponent } from '../../form-base.component';
import { ActivatedRoute } from '@angular/router';
import { AppFormInputs } from '../../../shared/types';
import { finalize } from 'rxjs';
import { BarcodeScannerComponent } from '../../../elements/barcode-scanner/barcode-scanner.component';
import { ModalService } from '../../../services/modal.service';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-form-add-hub-manually',
  templateUrl: './form-add-hub-manually.component.html',
  styleUrl: './form-add-hub-manually.component.scss',
})
export class FormAddHubManuallyComponent extends FormBaseComponent {
  @Input() description = '';
  private activatedRoute = inject(ActivatedRoute);
  private modalService = inject(ModalService);

  override onInit() {
    this.form.title = 'Add hub';
    this.form.description = this.description;
    this.form.inputs = [];
    this.form.inputs.push({
      key: 'identifier',
      title: 'Identificator',
      type: 'input',
      required: true,
    });
    this.form.inputs.push({
      key: 'token',
      title: 'Token',
      type: 'input',
      required: true,
    });

    this.form.inputs.push({
      key: 'scan',
      title: 'Scan QR Code',
      type: 'button',
      icon: 'arrow-right',
    });

    this.form.inputs.push({
      key: 'attach',
      title: 'Sign in',
      type: 'button',
      icon: 'arrow-right',
      isDisabled: () => this.formGroup.invalid,
      displayError: true,
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  private async requestPermission(): Promise<boolean | void> {
    const isSupported = await BarcodeScanner.isSupported();
    if (!isSupported) {
      return;
    }
    const result = await BarcodeScanner.requestPermissions();

    if (result.camera === 'granted') {
      return true;
    }
  }

  private async scanQR() {
    if (await this.requestPermission()) {
      const element = await this.modalService.showModal({
        component: BarcodeScannerComponent,
        cssClass: 'barcode-scanning-modal',
        showBackdrop: false,
      });
      const result = await element.onDidDismiss();
      const rawValue = result.data?.barcode?.rawValue;
      if (rawValue) {
        const data = JSON.parse(rawValue);
        this.formGroup.get('identifier')?.setValue(data.identifier);
        this.formGroup.get('token')?.setValue(data.token);
      }
    }
  }
  public button(button: AppFormInputs): void {
    switch (button.key) {
      case 'scan': {
        this.scanQR();
        break;
      }
      case 'attach': {
        const gateway = { ...this.formGroup.value };
        this.resetFormErrors();
        this.ui.lockBtn('attach');
        this.backend
          .gatewayConnect(gateway)
          .pipe(finalize(() => this.ui.unlockBtn('attach')))
          .subscribe((data: any) => {
            if (data && data.gateway && data.gateway.identifier) {
              this.storage.serverId = data.gateway.identifier;
              const hub = this.activatedRoute.snapshot.paramMap.get('hub');
              this.ui.getDeviceValues();
              this.router.navigate([`add-hub/${hub}/connected`]);
            }
          });
        break;
      }
    }
  }
}
