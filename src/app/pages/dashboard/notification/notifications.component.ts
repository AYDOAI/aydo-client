import { Component } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { Notification } from '../../../services/backend.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss',
})
export class NotificationsComponent extends BaseComponent {
  notifications: Notification[] = [];

  override onInit() {
    this.backend
      .getNotifications()
      .then(response => {
        this.notifications = response.items;
      })
      .catch(() => {});
  }

  closeNotification(ind: number) {
    this.notifications.splice(ind, 1);
  }

  goBack() {
    this.router.navigate([environment.index_url]);
  }
}
