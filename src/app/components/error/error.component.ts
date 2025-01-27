import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import { Subscription } from "rxjs";
import { ErrorsService } from "../../services/errors.service";
import { animate, style, transition, trigger } from "@angular/animations";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrl: './error.component.scss',
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('100ms', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('100ms', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ErrorComponent implements OnInit, OnDestroy {
  public errors: any[] = [];
  private showErrorSub: Subscription | null = null;
  private errorsService = inject(ErrorsService);

  ngOnInit(): void {
    this.showErrorSub = this.errorsService.showErrorSub().subscribe((data: any) => {
      this.errors.push(data);
    });
  }

  ngOnDestroy() {
    if (this.showErrorSub) {
      this.showErrorSub.unsubscribe();
    }
  }


  public close(): void {
    this.errors.splice(0, 1);
  }
}
