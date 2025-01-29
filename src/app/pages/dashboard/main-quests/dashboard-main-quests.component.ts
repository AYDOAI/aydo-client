import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { QuestsService } from '../../../services/quests.service';
import { QuestsModel } from '../../../models/quests.interface';

@Component({
  selector: 'app-dashboard-main-quests',
  templateUrl: './dashboard-main-quests.component.html',
  styleUrl: './dashboard-main-quests.component.scss',
})
export class DashboardMainQuestsComponent extends BaseComponent {
  quests!: QuestsModel[];

  private questsService = inject(QuestsService);

  override onInit() {
    this.questsService.getItems().subscribe(data => (this.quests = data));
  }
}
