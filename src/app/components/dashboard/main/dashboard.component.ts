import {Component} from '@angular/core';
import {BaseComponent} from '../../base.component';
import {Notification, Quest, Ranking, Reward} from '../../../services/backend.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent extends BaseComponent {

  notifications: Notification[] = [];
  rewards: Reward[] = [];
  mainQuests: Quest[] = [];
  additionalQuests: Quest[] = [];
  ranking!: Ranking;

  override onInit() {
    this.backend.getNotifications().then((response) => {
      this.notifications = response.items;
    }).catch(() => {
    });
    this.backend.getRewards().then((response) => {
      this.rewards = response.items;
    }).catch(() => {
    });
    this.backend.getMainQuests().then((response) => {
      this.mainQuests = response.items;
    }).catch(() => {
    });
    this.backend.getAdditionalQuests().then((response) => {
      this.additionalQuests = response.items;
    }).catch(() => {
    });
    this.backend.getRanking().then((response) => {
      this.ranking = response;
    }).catch(() => {
    });
  }

  closeNotification() {
    this.notifications.splice(0, 1);
  }

}
