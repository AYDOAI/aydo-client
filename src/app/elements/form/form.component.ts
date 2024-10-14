import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {FormGroup} from '@angular/forms';
import {AppForm, AppFormInputs, FrameStep} from '../../shared/types';
import {BaseElement} from '../base.component';
import { Location } from "@angular/common";
import { DialogService } from "../../services/dialog.service";
import { LicenseDialogComponent } from "../dialog/license-dialog/license-dialog.component";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent extends BaseElement {

  @Input() form!: AppForm;
  @Input() formGroup!: FormGroup;
  @Input() back!: FrameStep;
  @Input() btnDisabled: boolean = false;
  @Output() onClickButton: EventEmitter<any> = new EventEmitter<any>();

  private location = inject(Location);
  private dialog = inject(DialogService);

  button(input: AppFormInputs) {
    this.onClickButton.emit(input);
  }

  goBack() {
    this.location.back();
  }

  public openLicense(e: MouseEvent): void {
    e.preventDefault()
    this.dialog.show(LicenseDialogComponent, {
      headerTitle: 'License'
    })
  }
}
