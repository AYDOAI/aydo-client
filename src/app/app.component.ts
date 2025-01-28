import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { LoadingService } from './services/loading.service';
import { UIService } from './services/ui.service';

declare const gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'AYDO';

  constructor(
    public platform: Platform,
    public loading: LoadingService,
    public router: Router,
    public ui: UIService
  ) {
    this.platform.ready().then(_ => {
      if (this.platform.is('capacitor')) {
        const url = this.router.url;
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.setStyle({ style: Style.Light });
        if (this.ui.appReady) {
          this.updateStatusBarColor(url);
        }
      }
      this.subscribeToRouterEvents();
    });
  }

  private subscribeToRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-DF0L8MY2G4', { page_path: event.urlAfterRedirects });
        if (this.platform.is('capacitor')) {
          this.updateStatusBarColor(event.urlAfterRedirects);
        }
      }
    });
  }

  private async updateStatusBarColor(url: string): Promise<void> {
    try {
      if (url.includes('main')) {
        await StatusBar.setBackgroundColor({ color: '#947FFF' });
      } else {
        await StatusBar.setBackgroundColor({ color: '#EEF1E7' });
      }
    } catch (error) {
      console.error(error);
    }
  }
}
