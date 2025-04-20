import { Component, inject } from '@angular/core';
import { FormBaseComponent } from '../../form-base.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-add-hub-agreement',
  templateUrl: './form-add-hub-agreement.component.html',
  styleUrl: './form-add-hub-agreement.component.scss',
})
export class FormAddHubAgreementComponent extends FormBaseComponent {
  private activatedRoute = inject(ActivatedRoute);
  override onInit() {
    this.form.title = 'Add hub';
    this.form.inputs.push({
      key: 'connected',
      title: 'The hub is connected to your local network and online?',
      type: 'checkbox',
      requiredTrue: true,
      required: true,
    });
    this.form.inputs.push({
      key: 'local',
      title: 'You are on the same local network as the server',
      type: 'checkbox',
      requiredTrue: true,
      required: true,
    });
    this.form.inputs.push({
      key: 'policy',
      title: 'You agree to the application policy',
      type: 'checkbox',
      requiredTrue: true,
      required: true,
    });
    this.formGroup = this.createForm(this.form.inputs);
    this.form.inputs.push({
      key: 'btn',
      title: 'Next',
      type: 'button',
      icon: 'arrow-right',
      isDisabled: () => this.formGroup?.invalid,
    });
  }

  public next(): void {
    let hub = this.activatedRoute.snapshot.paramMap.get('hub');
    if (!hub) {
      const urlMatch = this.router.url.match('add-hub/([^/)+]+)');
      hub = urlMatch?.[1] ?? 'add';
    }
    this.navCtrl.navigateForward(`/add-hub/${hub}/search/manually`);
  }
}
