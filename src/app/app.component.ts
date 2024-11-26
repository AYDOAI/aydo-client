import {Component} from '@angular/core';
import {Subscription} from 'rxjs';
import {ErrorsService} from './services/errors.service';
import { LoadingService } from "./services/loading.service";
import { Platform } from '@ionic/angular';
import { UIService } from "./services/ui.service";
import {NavigationEnd, Router} from '@angular/router';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'AYDO';
  error: any[] = [];
  showErrorSub: Subscription;

  constructor(
    public errors: ErrorsService,
    public platform: Platform,
    public loading: LoadingService,
    public router: Router,
    public ui: UIService
  ) {
    this.showErrorSub = this.errors.showErrorSub().subscribe((data: any) => {
      this.error.push(data);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-LGWQ5QKCQ8', {'page_path': event.urlAfterRedirects});
      }
    });
  }
 
  closeError() {
    this.error.splice(0, 1);
  }
}
