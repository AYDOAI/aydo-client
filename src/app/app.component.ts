import { Component, NgZone } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Platform } from '@ionic/angular';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { NavigationBar } from '@capgo/capacitor-navigation-bar';
import { filter } from 'rxjs';
import { take } from 'rxjs/operators';
import { LoadingService } from './services/loading.service';
import { UIService } from './services/ui.service';
import { NavigationService } from './services/navigation.service';
import { ErrorHandlerService } from './services/error-handler.service';

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
    private zone: NgZone,
    private navigation: NavigationService,
    private errorHandler: ErrorHandlerService
  ) {
    this.init();
  }

  public get isMobile(): boolean {
    return (
      this.platform.is('mobile') ||
      this.platform.is('capacitor') ||
      /iPhone|iPad|Android/i.test(navigator.userAgent)
    );
  }

  public get isAndroid(): boolean {
    return this.platform.is('android');
  }

  private init(): void {
    this.platform.ready().then(_ => {
      if (this.isAndroid) {
        this.configureAndroidUI();
      }
      this.subscribeToRouterEvents();
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.setupAppLinksHandler();
      }
    });
  }

  private configureAndroidUI(): void {
    const currentUrl = this.router.url;

    StatusBar.setOverlaysWebView({ overlay: false });
    StatusBar.setStyle({ style: Style.Light });

    this.ui.appReady$
      .pipe(filter(Boolean), take(1))
      .subscribe(() => this.updateStatusBarColor(currentUrl));
  }

  private subscribeToRouterEvents(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        gtag('config', 'G-DF0L8MY2G4', { page_path: event.urlAfterRedirects });
        if (this.isAndroid) {
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

  private setupAppLinksHandler(): void {
    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const { pathname, searchParams } = new URL(event.url);
        const queryParams: Record<string, string> = {};

        searchParams.forEach((value, key) => {
          queryParams[key] = value;
        });

        this.ui.inviteId = queryParams['code'] ?? '';
        this.router.navigate([pathname], { queryParams });
      });
    });
  }
}
