import {Component} from '@angular/core';
import {BaseComponent} from '../base.component';
import {DataStream} from '../../services/backend.service';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss'
})
export class StreamsComponent extends BaseComponent {

  dataStreams!: DataStream[]

  override onInit() {
    this.backend.getDataStreams().then((response) => {
      this.dataStreams = response.items;
    }).catch(() => {
    });
  }

}
