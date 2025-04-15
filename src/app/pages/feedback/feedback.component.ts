import { Component } from '@angular/core';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss',
})
export class FeedbackComponent {
  public isModal: boolean = false;

  goToLink(url: string) {
    window.open(url, '_blank');
  }
}
