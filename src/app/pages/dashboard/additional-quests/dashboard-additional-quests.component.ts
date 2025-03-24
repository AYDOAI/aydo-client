import { Component } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { QuestsModel } from '../../../models/quests.interface';

@Component({
  selector: 'app-dashboard-additional-quests',
  templateUrl: './dashboard-additional-quests.component.html',
  styleUrl: './dashboard-additional-quests.component.scss',
})
export class DashboardAdditionalQuestsComponent extends BaseComponent {
  quests!: QuestsModel[];

  override onInit() {}
}
