import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { ViewWillEnter } from '@ionic/angular';
import { StreamService } from '../../../services/stream.service';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StreamsComponent extends BaseComponent implements ViewWillEnter {
  streamsService = inject(StreamService);
  streams$ = this.streamsService.streams$;

  ionViewWillEnter() {
    this.getDataStreams();
  }

  public getDataStreams(): void {
    this.streamsService.reloadData();
  }

  public openProject(i: number): void {
    this.router.navigate(['streams', i]);
  }
}
