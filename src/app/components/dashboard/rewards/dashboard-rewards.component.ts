import {Component} from '@angular/core';
import {BaseComponent} from '../../base.component';
import {Reward} from '../../../services/backend.service';

@Component({
  selector: 'app-dashboard-rewards',
  templateUrl: './dashboard-rewards.component.html',
  styleUrl: './dashboard-rewards.component.scss'
})
export class DashboardRewardsComponent extends BaseComponent {

  reward!: Reward;

  override onInit() {
    this.backend.getRewards().then((response) => {
      this.reward = response;
    }).catch(() => {
    });
  }

  goBack() {
    this.router.navigate(['/dashboard'])
  }

}
