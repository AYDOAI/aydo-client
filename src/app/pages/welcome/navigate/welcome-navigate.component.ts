import { Component, inject, Input } from '@angular/core';
import { UIService } from '../../../services/ui.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome-navigate',
  templateUrl: './welcome-navigate.component.html',
  styleUrl: './welcome-navigate.component.scss',
})
export class WelcomeNavigateComponent {
  public ui = inject(UIService);
  private navCtrl = inject(NavController);
  @Input() signIn = false;
  @Input() signUp = false;
  @Input() demo = false;
  @Input() forgot = false;

  public goToSignIn(): void {
    this.navCtrl.navigateForward('/sign-in');
  }

  public goToSignUp(): void {
    this.navCtrl.navigateForward('/sign-up');
  }

  public goToForgotPassword(): void {
    this.navCtrl.navigateForward('/forgot-password');
  }
}
