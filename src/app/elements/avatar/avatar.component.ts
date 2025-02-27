import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ErrorsService } from '../../services/errors.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject();
  errorService = inject(ErrorsService);
  previewUrl: string | ArrayBuffer | null = null;

  @Input() form!: FormGroup;
  @Input() key!: string;
  @Input() readonly: boolean | undefined = false;

  ngOnInit(): void {
    this.form
      .get(this.key)
      ?.valueChanges?.pipe(takeUntil(this.destroy$))
      ?.subscribe(value => {
        this.previewUrl = value.url;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > 1024 * 1024) {
      this.errorService.showError('File size must not exceed 1 MB.');
      fileInput.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result;
    };
    reader.readAsDataURL(file);
    this.form.get(this.key)?.setValue(file);

    fileInput.value = '';
  }

  removeImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.previewUrl = null;
    this.form.get(this.key)?.setValue(null);
  }
}
