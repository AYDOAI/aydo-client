import {Component} from '@angular/core';
import {BaseComponent} from '../../../components/base.component';
import {DataStream} from '../../../services/backend.service';
import { ViewWillEnter } from "@ionic/angular";

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss'
})
export class StreamsComponent extends BaseComponent implements ViewWillEnter {

  dataStreams: DataStream[] = [];

  ionViewWillEnter() {
    this.getDataStreams();
  }

  public getDataStreams(event?: any): void {
    this.backend.getDataStreams().then((data) => {
      console.log(data)
      this.dataStreams = data;
    }).catch(() => {
    }).finally(() => {
      if (event) {
        event.target.complete()
      }
    });
  }

  public openProject(i: number): void {
    this.router.navigate(['streams', i]);
  }

  public createObjURL(data: any) {
    return URL.createObjectURL(data)
  }

}
