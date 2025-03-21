import { Injectable, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ErrorsService } from './errors.service';
import { AppForm } from '../shared/types';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService implements OnDestroy {
  private errorSub: Subscription;
  private registeredForm: { form: AppForm; component: any } | null = null;
  private registeredComponents: Array<any> = [];

  constructor(private errors: ErrorsService) {
    this.errorSub = this.errors.errorSub().subscribe((message: any) => {
      const handledByForm = this.handleFormErrors(message);

      if (!handledByForm) {
        this.handleComponentErrors(message);
      }
    });
  }

  registerForm(form: AppForm, component: any): void {
    this.registeredForm = { form, component };
  }

  unregisterForm(component: any): void {
    this.registeredForm = null;
  }

  registerComponent(component: any): void {
    if (!this.registeredComponents.includes(component)) {
      this.registeredComponents.push(component);
    }
  }

  unregisterComponent(component: any): void {
    const index = this.registeredComponents.indexOf(component);
    if (index !== -1) {
      this.registeredComponents.splice(index, 1);
    }
  }

  private handleFormErrors(message: any): boolean {
    let formHandled = false;

    if (message && message.codes && message.errors && this.registeredForm) {
      const { form, component } = this.registeredForm;
      let inputFieldHandled = false;
      message.codes.forEach((code: string, index: number) => {
        const input = form.inputs.find(item => item.key === code);
        if (input) {
          input.error = message.errors[index];
          inputFieldHandled = true;
          formHandled = true;
        }
      });
      if (!inputFieldHandled && form.inputs.length > 0 && !formHandled) {
        component.errors.showError(message.message);
        formHandled = true;
      }
    }

    return formHandled;
  }

  private handleComponentErrors(message: any): void {
    if (this.registeredComponents.length > 0) {
      const firstComponent = this.registeredComponents[0];
      firstComponent.onError(message);
    }
  }

  ngOnDestroy(): void {
    if (this.errorSub) {
      this.errorSub.unsubscribe();
    }
  }
}
