import {Component} from '@angular/core';
import {BaseComponent} from '../../base.component';
import {Notification, Quest, Ranking, Reward} from '../../../services/backend.service';

@Component({
  selector: 'app-dashboard-rewards',
  templateUrl: './dashboard-rewards.component.html',
  styleUrl: './dashboard-rewards.component.scss'
})
export class DashboardRewardsComponent extends BaseComponent {

  override onInit() {
    console.log('fds')
    super.onInit();
  }
}
