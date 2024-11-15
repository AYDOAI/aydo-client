import {Component} from '@angular/core';
import {BaseComponent} from '../../base.component';
import {Quest} from '../../../services/backend.service';

@Component({
  selector: 'app-dashboard-additional-quests',
  templateUrl: './dashboard-additional-quests.component.html',
  styleUrl: './dashboard-additional-quests.component.scss'
})
export class DashboardAdditionalQuestsComponent extends BaseComponent {

  quests!: Quest[];

  override onInit() {
    this.backend.getAdditionalQuests().then((response) => {
      this.quests = response.items;
    }).catch(() => {
    });
  }

}
