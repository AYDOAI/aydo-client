import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
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
  `,
  styles: ['ion-content { min-height: 100vh; }']
})
export class ContentComponent implements OnInit, OnDestroy {

  @Input() class = '';
  @Input() scrollEvents = false;
  @Input() isRefreshable = false;
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
