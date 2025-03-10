import { Component } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';

@Component({
  selector: 'app-dashboard-rewards',
  templateUrl: './dashboard-rewards.component.html',
  styleUrl: './dashboard-rewards.component.scss',
})
export class DashboardRewardsComponent extends BaseComponent {
  override onInit() {
    this.getRewards();
  }

  goBack() {
    this.navCtrl.navigateBack(['/dashboard']);
  }

  getRewards(e?: any): void {
    this.ui.getUserRewards(e);
  }
}
