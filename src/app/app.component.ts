import {Component} from '@angular/core';
import { LoadingService } from "./services/loading.service";
import { MenuController, Platform } from '@ionic/angular';
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

  constructor(
    public platform: Platform,
    public loading: LoadingService,
    public router: Router,
    public ui: UIService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-DF0L8MY2G4', {'page_path': event.urlAfterRedirects});
      }
    });
  }
 }
