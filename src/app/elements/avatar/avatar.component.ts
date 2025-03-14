import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorsService } from '../../services/errors.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  errorService = inject(ErrorsService);
  platform = inject(Platform);
  previewUrl: string | ArrayBuffer | null = null;

  isOpenDialog = false;

  @Input() form!: FormGroup;
  @Input() key!: string;
  @Input() readonly: boolean | undefined = false;

  ngOnInit(): void {
    this.form
      .get(this.key)
      ?.valueChanges?.pipe(takeUntil(this.destroy$))
      ?.subscribe(value => {
        this.previewUrl = value?.url || null;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async pickImageFromGallery() {
    if (this.readonly || this.isOpenDialog) {
      return;
    }

    this.isOpenDialog = true;

    try {
      await this.checkPhotoPermissions();

      const image = await this.retrieveImageFromGallery();
      if (!image) {
        this.isOpenDialog = false;
        return;
      }

      await this.processSelectedImage(image);
    } catch (error) {
      this.errorService.showError(error);
    } finally {
      this.isOpenDialog = false;
    }
  }

  private async checkPhotoPermissions(): Promise<void> {
    const permissionStatus = await Camera.checkPermissions();

    if (permissionStatus?.photos !== 'granted') {
      const requestStatus = await Camera.requestPermissions({
        permissions: ['photos'],
      });

      if (requestStatus.photos !== 'granted') {
        throw new Error('Photo access permission denied');
      }
    }
  }

  private async retrieveImageFromGallery() {
    try {
      return await Camera.getPhoto({
        quality: 100,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
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

    const file = new File([blob], `avatar.${image.format}`, {
      type: `image/${image.format}`,
    });

    this.validateImageSize(file);
    this.updateFormAndPreview(file, image);
  }

  private validateImageSize(file: File) {
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File size must not exceed 1 MB');
    }
  }

  private updateFormAndPreview(file: File, image: Photo) {
    this.form.get(this.key)?.setValue(file);
    this.previewUrl = image.webPath!;
  }

  removeImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.previewUrl = null;
    this.form.get(this.key)?.setValue(null);
  }
}
