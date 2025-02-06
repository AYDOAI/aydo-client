import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { DataStream } from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  finalize,
  map,
  switchMap,
  take,
} from 'rxjs';
import { StreamService } from '../../../services/stream.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
})
export class ProjectComponent extends BaseComponent {
  private route = inject(ActivatedRoute);
  private streamService = inject(StreamService);

  private streamSubject = new BehaviorSubject<DataStream | null>(null);
  public stream$: Observable<DataStream | null> =
    this.streamSubject.asObservable();

  override onInit() {
    this.route.params
      .pipe(
        map(params => +params['id']),
        switchMap(id => this.streamService.getStreamById(id))
      )
      .subscribe({
        next: dataStream => this.streamSubject.next(dataStream),
      });
  }

  public copy(text: string): void {
    // TODO component, notification "text copied"?
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {})
        .catch(err => {
          console.error(err);
        });
    }
  }

  public toggle(): void {
    this.ui.lockBtn('streaming');

    const currentStream = this.streamSubject.getValue();
    if (!currentStream) {
      this.ui.unlockBtn('streaming');
      return;
    }

    this.streamService
      .toggleDataStream(currentStream.id)
      .pipe(finalize(() => this.ui.unlockBtn('streaming')))
      .subscribe({
        next: ({ status }) => {
          const oldValue = this.streamSubject.getValue();
          if (oldValue) {
            this.streamSubject.next({
              ...oldValue,
              status,
            });
          }
        },
      });
  }
}
