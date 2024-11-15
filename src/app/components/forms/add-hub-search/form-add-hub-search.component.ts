import {Component} from '@angular/core';
import {FormBaseComponent} from '../../form-base.component';

@Component({
  selector: 'app-form-add-hub-search',
  templateUrl: './form-add-hub-search.component.html',
  styleUrl: './form-add-hub-search.component.scss'
})
export class FormAddHubSearchComponent extends FormBaseComponent {

  override onInit() {
    this.form.title = 'Add hub';
    this.form.inputs.push({
      key: '',
      title: 'Wait, search is performed automatically',
      type: 'string'
    });
    this.form.inputs.push({
      key: '', title: '',
      type: 'template'
    })
    this.form.inputs.push({
      key: 'manually',
      title: 'Add manually',
      type: 'button',
      icon: 'plus'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  public button(): void {
    this.router.navigate([`${this.router.url.replace('automatically', 'manually')}`]);
  }

}
