import { Component, inject, Input } from '@angular/core';
import { UIService } from '../../../services/ui.service';

@Component({
  selector: 'app-welcome-navigate',
  templateUrl: './welcome-navigate.component.html',
  styleUrl: './welcome-navigate.component.scss',
})
export class WelcomeNavigateComponent {
  public ui = inject(UIService);
  @Input() signIn = false;
  @Input() signUp = false;
  @Input() demo = false;
  @Input() forgot = false;
}
