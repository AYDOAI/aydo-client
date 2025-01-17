import {Component} from '@angular/core';
import {LoadingService} from './services/loading.service';
import {Platform} from '@ionic/angular';
import {UIService} from './services/ui.service';
import {NavigationEnd, Router} from '@angular/router';
import {StatusBar} from '@capacitor/status-bar';

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
    this.platform.ready().then(_ => {
      if (this.platform.is('capacitor')) {
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.setBackgroundColor({ color: '#EEF1E7' });
      }
    })
  }
 }
