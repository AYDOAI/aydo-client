import { Component } from '@angular/core';
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
export class ErrorComponent {
  public error: any[] = [];
  private showErrorSub: Subscription | null = null;

  constructor(private errors: ErrorsService) {
    this.subscribeToErrors();
  }

  public close(): void {
    this.error.splice(0, 1);
  }

  private subscribeToErrors(): void {
    this.showErrorSub = this.errors.showErrorSub().subscribe((data: any) => {
      this.error.push(data);
    });
  }
}
