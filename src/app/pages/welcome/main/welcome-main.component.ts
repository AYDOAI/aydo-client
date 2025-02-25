import { Component, inject } from '@angular/core';
import { FormBaseComponent } from '../../../components/form-base.component';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'app-welcome-main',
  templateUrl: './welcome-main.component.html',
  styleUrl: './welcome-main.component.scss',
})
export class WelcomeMainComponent {
  public ui = inject(UIService);
}
