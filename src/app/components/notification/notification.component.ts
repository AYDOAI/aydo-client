import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { ErrorsService, INotification } from '../../services/errors.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate(
          '300ms ease-in',
          style({ opacity: 1, transform: 'translateY(0)' })
        ),
      ]),
      transition(':leave', [
        animate(
          '300ms ease-out',
          style({ opacity: 0, transform: 'translateY(10px)' })
        ),
      ]),
    ]),
  ],
})
export class NotificationComponent {
  notifications$: Observable<INotification[]>;

  constructor(private errors: ErrorsService) {
    this.notifications$ = this.errors.notificationsStream;
  }

  closeNotification(id: number) {
    this.errors.removeNotify(id);
  }
}
