import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBaseComponent } from '../../form-base.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-add-hub-found',
  templateUrl: './form-add-hub-found.component.html',
  styleUrl: './form-add-hub-found.component.scss'
})
export class FormAddHubFoundComponent extends FormBaseComponent {

  @Output() onNext: EventEmitter<void> = new EventEmitter<void>()

  private router = inject(Router);

  override onInit() {
    this.form.title = 'Add hub';
    this.form.inputs.push({
      key: '',
      title: 'Wait, search is performed automatically',
      type: 'string'
    });
    this.form.inputs.push({
      key: '',
      title: '',
      type: 'template',
    });
    this.form.inputs.push({
      key: 'manually',
      title: 'Next',
      type: 'button',
      icon: 'icon-right'
    });
    this.form.inputs.push({
      key: 'manually',
      title: 'Go to HUB',
      type: 'button',
      icon: 'icon-right'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(): void {
    this.onNext.emit();
  }

}
