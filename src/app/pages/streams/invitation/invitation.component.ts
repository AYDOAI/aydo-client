import { Component, inject } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { DataStream } from '../../../services/backend.service';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable, map, switchMap, filter, of } from 'rxjs';
import { StreamService } from '../../../services/stream.service';
import { ViewWillEnter } from '@ionic/angular';
import { FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrl: './invitation.component.scss',
})
export class InvitationComponent
  extends BaseComponent
  implements ViewWillEnter
{
  private route = inject(ActivatedRoute);
  private streamService = inject(StreamService);

  private streamSubject = new BehaviorSubject<DataStream | null>(null);
  public stream$: Observable<DataStream | null> =
    this.streamSubject.asObservable();

  public id!: number;
  public form!: FormGroup;

  ionViewWillEnter() {
    const url = this.router.url;
    const modalMatch = url.match(/\(modal:stream\/(\d+)\/invitation\)/);

    const id$ = modalMatch
      ? of(+modalMatch[1])
      : this.route.params.pipe(
          map(params => +params['id']),
          filter(id => !!id && !isNaN(id))
        );

    id$
      .pipe(
        switchMap(id => {
          this.id = id;
          return this.streamService.getStreamById(id);
        })
      )
      .subscribe({
        next: dataStream => {
          this.streamSubject.next(dataStream);
        },
      });
  }

  override onInit() {
    this.form = this.fb.group({
      inviteCode: ['', [Validators.required]],
    });
  }

  public goBack(): void {
    this.navCtrl.navigateBack(['/streams', this.id]);
  }

  public submitInviteCode(): void {
    this.errors.showError(
      'Sorry, the code you entered is incorrect. Please check and try again.'
    );
  }
}
