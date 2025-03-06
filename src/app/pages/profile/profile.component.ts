import { Component, inject } from '@angular/core';
import { AppFormInputs } from '../../shared/types';
import { FormBaseComponent } from '../../components/form-base.component';
import { ConfirmationModalComponent } from '../../elements/dialog/confirmation-modal/confirmation-modal.component';
import { DialogService } from '../../services/dialog.service';
import { UserService } from '../../services/user.service';
import { SocketService } from '../../services/socket.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent extends FormBaseComponent {
  private readonly dialog = inject(DialogService);
  private readonly userService = inject(UserService);
  private readonly socket = inject(SocketService);

  user$ = this.userService.user$;

  override onInit() {
    this.form.inputs = [
      {
        key: 'avatar',
        type: 'avatar',
        title: 'Avatar',
        readonly: true,
      },
      {
        key: 'firstname',
        title: 'First name',
        type: 'text',
      },
      {
        key: 'lastname',
        title: 'Last name',
        type: 'text',
      },
      {
        key: 'email',
        title: 'Email',
        type: 'text',
      },
      {
        key: 'edit',
        title: 'Edit',
        type: 'button',
        color: 'white',
        backgroundColor: '#060022',
      },
      {
        key: 'logout',
        title: 'Logout',
        type: 'button',
        color: 'white',
        backgroundColor: '#060022',
      },
      {
        key: 'delete',
        title: 'Delete profile',
        type: 'button',
        class: 'red-btn',
      },
    ];
    this.formGroup = this.createForm(this.form.inputs);
    this.socket.updateUserInfo$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.userService.reloadUser());
  }

  ionViewWillEnter() {
    this.user$.subscribe(user => {
      this.formGroup.patchValue(user);
    });
  }

  confirmDeleteProfile() {
    this.userService.requestDisposal().subscribe({
      next: () => {
        this.errors.showInfo(
          'To delete your profile, please follow the link sent to your email.'
        );
      },
    });
  }

  deleteProfile() {
    this.dialog.show(ConfirmationModalComponent, {
      title: 'Confirmation',
      description: 'Are you sure you want to delete your profile?',
      confirm: () => this.confirmDeleteProfile(),
    });
  }

  private logout() {
    this.resetFormErrors();
    this.ui.logout();
  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'logout':
        this.logout();
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
