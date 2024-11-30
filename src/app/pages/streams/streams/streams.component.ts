import {Component} from '@angular/core';
import {BaseComponent} from '../../../components/base.component';
import {DataStream} from '../../../services/backend.service';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss'
})
export class StreamsComponent extends BaseComponent {

  dataStreams: DataStream[] = [];

  override onInit() {
    this.backend.getDataStreams().then((data) => {
      console.log(data)
      this.dataStreams = data;
    }).catch(() => {
    });
  }

  public openProject(i: number): void {
    this.router.navigate(['streams', i]);
  }

  public createObjURL(data: any) {
    return URL.createObjectURL(data)
  }

}
