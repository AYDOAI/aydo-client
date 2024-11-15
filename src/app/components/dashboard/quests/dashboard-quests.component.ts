import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../base.component';
import {Quest} from '../../../services/backend.service';

@Component({
  selector: 'app-dashboard-quests',
  templateUrl: './dashboard-quests.component.html',
  styleUrl: './dashboard-quests.component.scss'
})
export class DashboardQuestsComponent extends BaseComponent {

  @Input() title!: string;
  @Input() quests!: Quest[];

  goBack() {
    this.router.navigate(['/dashboard'])
  }

}
