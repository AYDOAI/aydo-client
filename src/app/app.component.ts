import { Component, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
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
    public ui: UIService,
    private zone: NgZone
  ) {
    this.init();
  }

  private init(): void {
    this.platform.ready().then(_ => {
      if (this.ui.isMobile) {
        const url = this.router.url;
        StatusBar.setOverlaysWebView({ overlay: false });
        StatusBar.setStyle({ style: Style.Light });
        if (this.platform.is('android')) {
          this.updateStatusBarColor(url);
        }
      }
      this.subscribeToRouterEvents();
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.initAppLinksHandler();
      }
    });
  }

  private subscribeToRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-DF0L8MY2G4', { page_path: event.urlAfterRedirects });
        if (this.platform.is('android')) {
          this.updateStatusBarColor(event.urlAfterRedirects);
        }
      }
    });
  }

  private async updateStatusBarColor(url: string): Promise<void> {
    try {
      if (url.includes('main')) {
        await StatusBar.setBackgroundColor({ color: '#947FFF' });
        await NavigationBar.setNavigationBarColor({ color: '#947FFF' });
      } else {
        await StatusBar.setBackgroundColor({ color: '#EEF1E7' });
        await NavigationBar.setNavigationBarColor({ color: '#EEF1E7' });
      }
    } catch (error) {
      console.error(error);
    }
  }

  private initAppLinksHandler(): void {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const { pathname, searchParams } = new URL(event.url);
        const queryParams: { [key: string]: string } = {};
        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });
        this.ui.inviteId = queryParams['code'] ?? '';
        this.router.navigate([pathname], { queryParams });
      });
    });
  }
}
