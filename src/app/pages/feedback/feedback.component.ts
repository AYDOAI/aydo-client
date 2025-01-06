import {Component, OnInit, inject} from '@angular/core';
import {DialogService} from "../../services/dialog.service";


@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrl: './feedback.component.scss'
})
export class FeedbackComponent implements OnInit {
  private dialog = inject(DialogService);

  ngOnInit(): void {

  }
  
  goToLink(url: string) {
    window.open(url, "_blank");
  }
}
