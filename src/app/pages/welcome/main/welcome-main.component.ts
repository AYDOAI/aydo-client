import { Component, inject } from '@angular/core';
import { UIService } from '../../../services/ui.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome-main',
  templateUrl: './welcome-main.component.html',
  styleUrl: './welcome-main.component.scss',
})
export class WelcomeMainComponent {
  public ui = inject(UIService);
  private navCtrl = inject(NavController);

  public goToSignIn(): void {
    this.navCtrl.navigateForward('/sign-in');
  }

  public goToSignUp(): void {
    this.navCtrl.navigateForward('/sign-up');
  }
}
