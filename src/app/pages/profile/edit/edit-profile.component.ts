import { Component, inject } from '@angular/core';
import { AppFormInputs } from '../../../shared/types';
import { FormBaseComponent } from '../../../components/form-base.component';
import { UploaderService } from '../../../services/uploader.service';
import {
  finalize,
  first,
  catchError,
  switchMap,
  of,
  map,
  Observable,
} from 'rxjs';
import { UserService } from '../../../services/user.service';
import { GeolocationService } from '../../../services/geolocation.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss',
})
export class EditProfileComponent extends FormBaseComponent {
  private readonly uploader = inject(UploaderService);
  private readonly userService = inject(UserService);
  private readonly geolocationService = inject(GeolocationService);

  user$ = this.userService.user$;

  override onInit() {
    this.form.inputs = [
      {
        key: 'avatar',
        type: 'avatar',
        title: 'Avatar',
      },
      {
        key: 'firstname',
        title: 'First name',
        type: 'input',
        maxLength: 256,
        required: true,
        onlyLetters: true,
      },
      {
        key: 'lastname',
        title: 'Last name',
        type: 'input',
        maxLength: 256,
        required: true,
        onlyLetters: true,
      },
      {
        key: 'location',
        title: 'Location',
        type: 'google-map',
        required: false,
      },
      {
        key: 'submit',
        title: 'Save',
        type: 'button',
        color: 'white',
        displayError: true,
        backgroundColor: '#060022',
      },
    ];
    this.formGroup = this.createForm(this.form.inputs);
  }

  override ionViewDidEnter() {
    this.user$.subscribe(user => {
      this.formGroup.patchValue(user);
    });
    super.ionViewDidEnter();
  }

  async sendUpdateUser(avatarId: string | null, realLocation?: string) {
    this.ui.lockBtn('submit');
    this.backend
      .updateUser({
        avatarId,
        firstname: this.formGroup.value.firstname,
        lastname: this.formGroup.value.lastname,
        wallet: '',
        location: this.formGroup.value.location,
        realLocation,
      })
      .pipe(finalize(() => this.ui.unlockBtn('submit')))
      .subscribe(res => {
        this.ui.user = res;
        this.userService.updateUser({
          ...res,
          avatar: res.avatar || null,
        });
        this.errors.showInfo('Profile changed successfully.');
      });
  }

  updateProfile() {
    const hasLocation = !!this.formGroup.value.location;

    const processUpdate = (realLocation?: string) => {
      if (
        this.formGroup.value.avatar &&
        this.formGroup.value.avatar instanceof File
      ) {
        this.ui.lockBtn('submit');

        this.uploader.upload(this.formGroup.value.avatar).subscribe({
          next: response => {
            this.sendUpdateUser(response.id, realLocation);
          },
          error: () => {
            this.errors.showError('Failed to upload avatar. Please try again.');
            this.ui.unlockBtn('submit');
          },
        });
      } else {
        this.sendUpdateUser(
          this.formGroup.value.avatar?.fileId || null,
          realLocation
        );
      }
    };

    if (hasLocation) {
      this.geolocationService
        .getCurrentPosition()
        .pipe(first())
        .subscribe({
          next: position => {
            const locationString = `(${position.lat},${position.lng})`;
            processUpdate(locationString);
          },
          error: () => {
            processUpdate();
          },
        });
    } else {
      processUpdate();
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
