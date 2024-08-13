import {Component} from '@angular/core';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-form-add-hub-connected',
  templateUrl: './form-add-hub-connected.component.html',
  styleUrl: './form-add-hub-connected.component.scss'
})
export class FormAddHubConnectedComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Add hub';
    this.form.description = 'AYDO Hub connected'
    this.form.inputs.push({
      key: 'btn',
      title: 'Go to dashboard',
      type: 'button',
      icon: 'arrow-right'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(): void {
    this.router.navigate(['']);
  }

}
