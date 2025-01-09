import {Component, Input} from '@angular/core';
import {BaseComponent} from '../../../components/base.component';
import {environment} from '../../../../environments/environment';
import { QuestsModel } from '../../../models/quests.interface';

@Component({
  selector: 'app-dashboard-quests',
  templateUrl: './dashboard-quests.component.html',
  styleUrl: './dashboard-quests.component.scss'
})
export class DashboardQuestsComponent extends BaseComponent {

  @Input() title!: string;
  @Input() quests!: QuestsModel[];

  goBack() {
    this.router.navigate([environment.index_url])
  }

}
