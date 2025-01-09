import {Component, EventEmitter, Input, Output} from "@angular/core";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent {
  previewUrl: string | ArrayBuffer | null = null;

  @Input() form!: FormGroup;
  @Input() key!: string;

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.form.get(this.key)?.setValue(file);

      fileInput.value = '';
    }
  }

  removeImage(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.previewUrl = null;
    this.form.get(this.key)?.setValue(null);
  }
}
