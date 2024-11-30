import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  template: `
        <ion-content
            [fullscreen]="false"
            [forceOverscroll]="false"
            [ngClass]="class"
        >
            <ng-content/>
        </ion-content>
    `,
  styles: ['ion-content { min-height: 100vh; }']
})
export class ContentComponent implements OnInit, OnDestroy {

  @Input() class = '';
  @Input() scrollEvents = false;

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }
}
