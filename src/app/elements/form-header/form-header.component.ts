import { Component, inject, Input } from '@angular/core';
import { AppForm, FrameStep } from '../../shared/types';
import { BaseElement } from '../base.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrl: './form-header.component.scss'
})
export class FormHeaderComponent extends BaseElement {

  @Input() form!: AppForm;
  @Input() back!: FrameStep;

  private location = inject(Location);

  goBack() {
    this.location.back()
  }
}
