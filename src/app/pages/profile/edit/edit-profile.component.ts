import { Component, inject } from '@angular/core';
import {AppFormInputs} from '../../../shared/types';
import {FormBaseComponent} from '../../../components/form-base.component';
import {UploaderService} from "../../../services/uploader.service";
import { finalize } from "rxjs";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent extends FormBaseComponent {
  private readonly uploader = inject(UploaderService);
  private readonly userService = inject(UserService);

  user$ = this.userService.user$;

  override onInit() {
    this.user$.subscribe((user) => {
      this.form.inputs = [
        {
          key: 'avatar',
          type: 'avatar',
          title: 'Avatar',
          defaultValue: user.avatar
        },
        {
          key: 'firstname',
          title: 'First name',
          type: 'input',
          maxLength: 256,
          required: true,
          onlyLetters: true,
          defaultValue: user.firstname,
        },
        {
          key: 'lastname',
          title: 'Last name',
          type: 'input',
          maxLength: 256,
          required: true,
          onlyLetters: true,
          defaultValue: user.lastname,
        },
        {
          key: 'submit',
          title: 'Save',
          type: 'button',
          color: 'white',
          displayError: true,
          backgroundColor: '#060022'
        }
      ];
      this.formGroup = this.createForm(this.form.inputs);
    });
  }

  async sendUpdateUser(avatarId: string | null) {
    this.ui.lockBtn('submit');
    this.backend.updateUser({
      avatarId,
      firstname: this.formGroup.value.firstname,
      lastname: this.formGroup.value.lastname,
      wallet: ''
    }).pipe(finalize(() => this.ui.unlockBtn('submit'))).subscribe(res => {
      this.ui.user = res;
      this.userService.updateUser(res);
      this.errors.showInfo('Profile changed successfully.');
    })
  }

   updateProfile() {
    if (this.formGroup.value.avatar && this.formGroup.value.avatar instanceof File) {
      this.ui.lockBtn('submit');

      this.uploader.upload(this.formGroup.value.avatar).subscribe({
        next: (response) => {
          this.sendUpdateUser(response.id);
        },
        error: (err) => {
          this.errors.showError('Failed to upload avatar. Please try again.');
          this.ui.unlockBtn('submit');
        }
      });
    } else {
      this.sendUpdateUser(this.formGroup.value.avatar?.id || null);
    }

  }

  button(input: AppFormInputs) {
    switch (input.key) {
      case 'submit':
        this.updateProfile();
        break;
    }
  }
}
