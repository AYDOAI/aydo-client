import {Component, inject} from '@angular/core';
import {BaseComponent} from '../../../components/base.component';
import {DataStream} from '../../../services/backend.service';
import { ViewWillEnter } from "@ionic/angular";
import {StreamService} from "../../../services/stream.service";
import { finalize } from "rxjs";

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss'
})
export class StreamsComponent extends BaseComponent implements ViewWillEnter {

  streamsService = inject(StreamService);
  streams$ = this.streamsService.streams$;

  dataStreams: DataStream[] = [];

  ionViewWillEnter() {
    this.getDataStreams();
  }

  public getDataStreams(event?: any): void {
    this.backend.getDataStreams().pipe(finalize(() => {
      if (event) {
        event.target.complete()
      }
    })).subscribe((data) => {
      console.log(data)
      this.dataStreams = data;
    });
  }

  public openProject(i: number): void {
    this.router.navigate(['streams', i]);
  }

  public createObjURL(data: any) {
    return URL.createObjectURL(data)
  }

}
