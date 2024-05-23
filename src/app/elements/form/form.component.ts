import {Component, Input} from '@angular/core';
import {AppForm} from '../../shared/types';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent {

  @Input() form: AppForm = {title: '', inputs: []};

}
