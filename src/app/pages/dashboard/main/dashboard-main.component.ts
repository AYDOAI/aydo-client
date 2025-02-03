import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { QuestsService } from '../../../services/quests.service';

@Component({
  selector: 'app-dashboard-main',
  templateUrl: './dashboard-main.component.html',
  styleUrl: './dashboard-main.component.scss',
})
export class DashboardMainComponent extends BaseComponent {
  public questsLength = 0;
  private questsService = inject(QuestsService);

  override onInit() {
    this.questsService.getItems().subscribe(data => {
      this.questsLength = data.length;
    });
  }

  navigate(page: string) {
    this.navCtrl.navigateForward([page]);
  }
}
