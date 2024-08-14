import {Component} from '@angular/core';
import {BaseComponent} from '../../base.component';
import {Notification, Quest, Ranking, Reward} from '../../../services/backend.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss'
})
export class DashboardMainComponent extends BaseComponent {

  notifications: Notification[] = [];
  reward!: Reward;
  mainQuests: Quest[] = [];
  additionalQuests: Quest[] = [];
  ranking!: Ranking;

  override onInit() {
    this.backend.getNotifications().then((response) => {
      this.notifications = response.items;
    }).catch(() => {
    });
    this.backend.getRewards().then((response) => {
      this.reward = response;
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

  navigate(page: string, arr: any = null) {
    if (!arr || arr.length) {
      this.router.navigate(['dashboard', page])
    }
  }

}
