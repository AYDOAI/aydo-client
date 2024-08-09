import { Component, inject } from '@angular/core';
import { FormBaseComponent } from '../../form-base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-add-hub-agreement',
  templateUrl: './form-add-hub-agreement.component.html',
  styleUrl: './form-add-hub-agreement.component.scss'
})
export class FormAddHubAgreementComponent extends FormBaseComponent {

  private router = inject(Router);

  override onInit() {
    this.form.title = 'Add hub';
    this.form.inputs.push({
      key: 'connected',
      title: 'The hub is connected to your local network and online?',
      type: 'checkbox',
      required: true
    });
    this.form.inputs.push({
      key: 'local',
      title: 'You are on the same local network as the server',
      type: 'checkbox',
      required: true
    });
    this.form.inputs.push({
      key: 'policy',
      title: 'You agree to the application policy',
      type: 'checkbox',
      required: true
    });
    this.form.inputs.push({
      key: 'btn',
      title: 'Next',
      type: 'button',
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public next(): void {
    this.router.navigate([`${this.router.url}/search`]);
  }

}
