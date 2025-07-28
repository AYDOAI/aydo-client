import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { ModalService } from '../../../services/modal.service';
import { UploaderService } from '../../../services/uploader.service';
import { BaseComponent } from '../../../components/base.component';
import { DevicesService } from '../../../services/devices.service';
import { switchMap } from 'rxjs';

@Component({
  selector: 'app-device-verify',
  templateUrl: './device-verify.component.html',
  styleUrls: ['./device-verify.component.scss'],
})
export class DeviceVerifyComponent
  extends BaseComponent
  implements OnInit, OnDestroy
{
  private modalService = inject(ModalService);
  private uploaderService = inject(UploaderService);
  private devicesService = inject(DevicesService);

  @Input() deviceId?: string;
  @Input() deviceName?: string;
  @Input() currentPhotoUrl?: string;

  isOpenDialog = false;
  previewUrl: string | null = null;
  isUploading = false;

  form = new FormGroup({
    photo: new FormControl<File | null>(null, Validators.required),
    description: new FormControl('', [Validators.maxLength(200)]),
  });

  override ngOnInit() {
    super.ngOnInit();

    if (!this.deviceId && !this.deviceName) {
      const selectedDevice = this.devicesService.getSelectedDevice();
      if (selectedDevice) {
        this.deviceId = selectedDevice.ident;
        this.deviceName = selectedDevice.name;
        this.currentPhotoUrl = selectedDevice.photo?.url;
      } else if (!this.isModal) {
        this.navCtrl.navigateBack('/devices');
        return;
      }
    }

    if (this.currentPhotoUrl) {
      this.previewUrl = this.currentPhotoUrl;
    }
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
  }

  async pickImageFromCamera() {
    if (this.isOpenDialog) return;

    this.isOpenDialog = true;

    try {
      await this.checkCameraPermissions();
      const image = await this.retrieveImageFromCamera();
      if (image) {
        await this.processSelectedImage(image);
      }
    } catch (error) {
      this.errors.showError(error);
    } finally {
      this.isOpenDialog = false;
    }
  }

  private async checkCameraPermissions(): Promise<void> {
    const permissionStatus = await Camera.checkPermissions();

    if (permissionStatus?.camera !== 'granted') {
      const requestStatus = await Camera.requestPermissions({
        permissions: ['camera'],
      });

      if (requestStatus.camera !== 'granted') {
        throw new Error('Camera access permission denied');
      }
    }
  }

  private async retrieveImageFromCamera() {
    try {
      return await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
        saveToGallery: false,
        correctOrientation: true,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('cancelled')) {
        return null;
      }
      throw error;
    }
  }

  private async processSelectedImage(image: Photo) {
    const response = await fetch(image.webPath!);
    const blob = await response.blob();

    const file = new File([blob], `device_photo.${image.format}`, {
      type: `image/${image.format}`,
    });

    this.validateImageSize(file);
    this.form.get('photo')?.setValue(file);
    this.previewUrl = image.webPath!;
  }

  private validateImageSize(file: File) {
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new Error('Image size should not exceed 10MB');
    }
  }

  removeImage() {
    this.previewUrl = null;
    this.form.get('photo')?.setValue(null);
  }

  async savePhoto() {
    if (this.form.invalid || this.isUploading) return;

    const photoFile = this.form.get('photo')?.value;

    if (!photoFile) {
      this.errors.showError('Please select a photo');
      return;
    }

    this.isUploading = true;

    try {
      this.uploaderService
        .upload(photoFile)
        .pipe(
          switchMap(({ id }) => {
            return this.devicesService.verifyDevice(this.deviceId!, {
              photoId: id,
            });
          })
        )
        .subscribe(() => {
          this.errors.showInfo('Verification under review. Please wait...');
          this.cancel();
        });
    } catch (error) {
      this.errors.showError('Failed to upload photo');
    } finally {
      this.isUploading = false;
    }
  }

  cancel() {
    if (this.isModal) {
      this.modalService.dismissModal();
    } else {
      this.navCtrl.navigateBack('/devices');
    }
  }
}
