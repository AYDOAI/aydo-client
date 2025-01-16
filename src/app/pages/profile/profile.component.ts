import {Component, inject} from '@angular/core';
import {AppFormInputs} from '../../shared/types';
import {FormBaseComponent} from '../../components/form-base.component';
import {ConfirmationModalComponent} from "../../elements/dialog/confirmation-modal/confirmation-modal.component";
import {DialogService} from "../../services/dialog.service";
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent extends FormBaseComponent {
  private readonly dialog = inject(DialogService);
  private readonly userService = inject(UserService);

  override onInit() {
    this.form.title = 'Profile';

    if (this.ui.user && this.ui.user?.login) {

      this.form.inputs.push({
        key: 'firstname',
        title: 'First name',
        type: 'text',
        defaultValue: this.ui.user.firstname,
      });
      this.form.inputs.push({
        key: 'lastname',
        title: 'Last name',
        type: 'text',
        defaultValue: this.ui.user.lastname,
      });
      // this.form.inputs.push({
      //   key: 'wallet',
      //   title: 'Wallet',
      //   type: 'text',
      //   defaultValue: this.ui.user.wallet,
      // });
      this.form.inputs.push({
        key: 'email',
        title: 'Email',
        type: 'text',
        defaultValue: this.ui.user.email,
      });
      // this.form.inputs.push({
      //   key: 'balance',
      //   title: 'Balance',
      //   type: 'text',
      //   defaultValue: this.ui.user.balance,
      // });
    }
    if (this.ui.user?.email !== 'test@aydo.ai') {
      this.form.inputs.push({
        key: 'edit',
        title: 'Edit',
        type: 'button',
        color: 'white',
        backgroundColor: '#060022'
      });
    }
    this.form.inputs.push({
      key: 'logout',
      title: 'Logout',
      type: 'button',
      color: 'white',
      backgroundColor: '#060022'
    });
    this.form.inputs.push({
      key: 'delete',
      title: 'Delete profile',
      type: 'button',
      class: 'red-btn'
    });

    this.formGroup = this.createForm(this.form.inputs);
  }

  confirmDeleteProfile() {
    this.userService.requestDisposal().subscribe({
      next: () => {
        this.errors.showInfo('To delete your profile, please follow the link sent to your email.');
      }
    });
  }

  deleteProfile() {
    this.dialog.show(ConfirmationModalComponent, {
      title: 'Confirmation',
      description: 'Are you sure you want to delete your profile?',
      confirm: () => this.confirmDeleteProfile()
    });
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'logout':
        this.resetFormErrors();
        this.ui.logout();
        break;
      case 'delete':
        this.deleteProfile();
        break;
      case 'edit':
        this.router.navigate(['/profile/edit']);
        break;
    }
  }
}
