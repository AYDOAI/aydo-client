import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
    <div class="ion-page">
      <ion-content
        [fullscreen]="false"
        [forceOverscroll]="false"
        [ngClass]="class"
      >
        <ion-refresher *ngIf="isRefreshable"
                       slot="fixed"
                       (ionRefresh)="refresh.emit($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <ng-content/>
      </ion-content>
    </div>
  `,
  styles: ['']
})
export class ContentComponent implements OnInit, OnDestroy {

  @Input() class = '';
  @Input() isRefreshable = false;
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
