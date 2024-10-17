import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
export class FormComponent extends BaseElement implements OnInit {

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

  ngOnInit(): void {
    this.subscribeToFormChanges();
  }

  public get formError(): string {
    for (const input of this.form?.inputs) {
      if (input.error) {
        return input.error;
      }
    }
    return '';
  }

  private subscribeToFormChanges(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.form.inputs.forEach(element => {
        const control = this.formGroup.get(element.key) as FormControl;
        if (control && control.invalid) {
          element.error = this.getErrorText(element.key, element.title);
        } else {
          element.error = '';
        }
      });
    });
  }

  private getErrorText(controlName: string, title: string): string {
    const control = this.formGroup.get(controlName) as FormControl;
    if (control.hasError('required')) {
      return `${title} is required`;
    } else if (control.hasError('email')) {
      return `${title} is invalid`;
    } else if (control.hasError('minlength')) {
      return `${title} must be more than ${control.getError('minlength').requiredLength} characters`;
    } else if (control.hasError('maxlength')) {
      return `${title} must be less than ${control.getError('maxlength').requiredLength} characters`;
    } else if (control.hasError('pattern')) {
      return `${title} does not match the required pattern`;
    } else if (control.hasError('requiredTrue')) {
      return `${title} must be checked`;
    } else if (control.hasError('fieldMatch')) {
      return `${title} does not match`;
    } else if (control.hasError('onlyLetters')) {
      return `${title} must contain only letters`;
    } else {
      return '';
    }
  }
}
