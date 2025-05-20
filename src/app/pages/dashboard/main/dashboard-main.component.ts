import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { QuestsService } from '../../../services/quests.service';
import { ClipboardService } from '../../../services/clipboard.service';
import { UserService } from '../../../services/user.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent extends BaseComponent {
  public questsLength = 0;
  public refLink: string = '';
  public userService = inject(UserService);
  public balance$ = this.userService.user$.pipe(
    map(user => user?.balance || 0)
  );
  private questsService = inject(QuestsService);
  private clipboard = inject(ClipboardService);

  override onInit() {
    this.refLink = 'app.aydo.ai?code=' + this.ui.user?.invite_code;

    this.questsService.getItems().subscribe(data => {
      this.questsLength = data.length;
    });
  }

  navigate(page: string) {
    this.navCtrl.navigateForward([page]);
  }

  copyRefLink(event: MouseEvent | TouchEvent): void {
    this.clipboard.copy(`https://${this.refLink}`, event);
  }
}
