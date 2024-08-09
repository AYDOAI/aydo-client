import { Component, inject, Input } from '@angular/core';
import { FormBaseComponent } from '../../form-base.component';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-add-hub-manually',
  templateUrl: './form-add-hub-manually.component.html',
  styleUrl: './form-add-hub-manually.component.scss'
})
export class FormAddHubManuallyComponent extends FormBaseComponent {

  @Input() description = '';

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

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
      key: 'signIn',
      title: 'Sign in',
      type: 'button'
    });
    this.form.inputs.push({
      key: 'scan',
      title: 'Scan QR Code',
      type: 'button'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(): void {
    const hub = this.activatedRoute.snapshot.paramMap.get('hub');
    this.router.navigate([`add-hub/${hub}/connected`]);
  }

}
