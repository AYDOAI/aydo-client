import {Component} from '@angular/core';
import {BaseComponent} from '../../base.component';
import { Notification } from "../../../services/backend.service";

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent extends BaseComponent {

  notifications: Notification[] = [];

  override onInit() {
    this.backend.getNotifications().then((response) => {
      this.notifications = response.items;
    }).catch(() => {
    });
  }

  closeNotification(ind: number) {
    this.notifications.splice(ind, 1);
  }

}
