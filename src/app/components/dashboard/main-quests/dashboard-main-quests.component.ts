import {Component} from '@angular/core';
import {BaseComponent} from '../../base.component';
import {Quest} from '../../../services/backend.service';

@Component({
  selector: 'app-dashboard-main-quests',
  templateUrl: './dashboard-main-quests.component.html',
  styleUrl: './dashboard-main-quests.component.scss'
})
export class DashboardMainQuestsComponent extends BaseComponent {

  quests!: Quest[];

  override onInit() {
    this.backend.getMainQuests().then((response) => {
      this.quests = response.items;
    }).catch(() => {
    });
  }

}
