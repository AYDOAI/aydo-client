import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { SocketService } from '../../../services/socket.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-rewards',
  templateUrl: './dashboard-rewards.component.html',
  styleUrl: './dashboard-rewards.component.scss',
})
export class DashboardRewardsComponent extends BaseComponent {
  private socket = inject(SocketService);

  override onInit() {
    this.getRewards();
    this.socket.updateUserRewards$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.getRewards());
  }

  goBack() {
    this.navCtrl.navigateBack(['/dashboard']);
  }

  getRewards(e?: any): void {
    this.ui.getUserRewards(e);
  }
}
