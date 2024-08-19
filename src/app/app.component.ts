import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {ErrorsService} from './services/errors.service';
import { LoadingService } from "./services/loading.service";
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AYDO';
  error: any[] = [];
  showErrorSub: Subscription;

  constructor(public errors: ErrorsService,
              public platform: Platform,
              public loading: LoadingService) {
    this.showErrorSub = this.errors.showErrorSub().subscribe((data: any) => {
      this.error.push(data);
    });
  }

  closeError() {
    this.error.splice(0, 1);
  }

}
