import { Injectable, OnDestroy } from '@angular/core';
import { App } from '@capacitor/app';
import { HubType, FrameStep } from '../shared/types';
import { StorageService } from './storage.service';
import {
  BehaviorSubject,
  finalize,
  interval,
  of,
  startWith,
  Subscription,
} from 'rxjs';
import { BackendService } from './backend.service';
import {
  DeviceItem,
  DevicesModel,
  DriverItem,
  DriversModel,
} from '../models/gateway.model';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { Network } from '@capacitor/network';
import { NavController, Platform } from '@ionic/angular';
import { ErrorsService } from './errors.service';
import { UserInfo, UserRewards } from '../models/users.model';
import { UserService } from './user.service';
import { switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { SocketService } from './socket.service';

@Injectable({
  providedIn: 'root',
})
export class UIService implements OnDestroy {
  private _step!: FrameStep;
  selectedHubType: HubType = 'hub_aydo';
  initSub: Subscription | undefined;
  drivers!: DriversModel;
  selectedDriver!: DriverItem | undefined;
  selectedDevice!: DeviceItem | undefined;
  devices!: DevicesModel;
  user: UserInfo | null | undefined = null;
  rewards: UserRewards[] = [];
  public appReady: boolean = false;
  public inviteId: string;
  public isOnline: boolean = true;
  public isAppFocused$ = new BehaviorSubject<boolean>(true);
  public gateway:
    | { identifier: string; userId: string; token: string; is_online: boolean }
    | null
    | undefined = null;
  private btnLoading: string[] = [];

  constructor(
    public storage: StorageService,
    public backend: BackendService,
    public router: Router,
    public navCtrl: NavController,
    private loading: LoadingService,
    private errors: ErrorsService,
    private userService: UserService,
    private iab: InAppBrowser,
    private platform: Platform,
    private socket: SocketService
  ) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    this.inviteId = urlSearchParams.get('code') ?? '';
    this.initSub = this.loading
      .showLoading$(this.storage.initSub())
      .subscribe(data => {
        this.afterLogin();
      });
    this.subscribeToNetworkStatus();
    this.subscribeToFocusState();
  }

  public get isMobile(): boolean {
    return (
      this.platform.is('mobile') ||
      this.platform.is('android') ||
      this.platform.is('ios') ||
      /iPhone|iPad|Android/i.test(navigator.userAgent)
    );
  }

  ngOnDestroy() {
    this.initSub?.unsubscribe();
  }

  tryDemo(): void {
    this.lockBtn('try_demo');
    this.backend
      .demoLogin()
      .pipe(
        finalize(() => {
          this.unlockBtn('try_demo');
        })
      )
      .subscribe(
        () => {
          this.afterLogin();
        },
        () => {
          this.errors.showError(`An error occurred, please try again later`);
        }
      );
  }

  afterLogin() {
    if (this.storage.token) {
      this.loading.showLoading();
      this.userService.reloadUser();
      this.backend
        .userInfo()
        .pipe(
          finalize(() => {
            this.appReady = true;
            this.loading.dismissLoading();
            if (this.user && !this.user?.is_verified) {
              this.goStep('success');
              return;
            }
            if (
              this.isAuthPage() &&
              !this.router.url.includes('privacy-policy')
            ) {
              this.defaultStep();
            }
          })
        )
        .subscribe(
          (user: UserInfo) => {
            this.user = user;
            const next = () => {
              this.loading.showLoading();
              this.getDevices();
              this.getUserRewards();
              if (
                this.isAuthPage() &&
                !this.router.url.includes('privacy-policy')
              ) {
                this.defaultStep();
              }
            };
            this.loading.showLoading();
            this.getGateway(next);
            this.socket.connect();
          },
          error => {
            this.goStep('sign-in');
            if (error && error.name === 'JsonWebTokenError') {
              //   this.backend.userRefresh().then(data => {
              //     console.log(data);
              //   }).catch((error) => {
              //     console.log(error);
              //   })
            }
          }
        );
    } else {
      this.appReady = true;
      this.loading.dismissLoading();
      if (!this.isAuthPage()) {
        this.goStep('main');
      }
    }
  }

  getUserRewards(e?: any): void {
    this.backend
      .userRewards()
      .pipe(
        finalize(() => {
          if (e) {
            e.target.complete();
          }
        })
      )
      .subscribe(data => (this.rewards = data));
  }

  // get step(): FrameStep {
  //   return this._step;
  // }

  goStep(step: FrameStep) {
    this._step = step;
    this.navCtrl.navigateForward([`/${step}`]);
  }

  defaultStep() {
    this.goStep('dashboard');
  }

  public logout(): void {
    this.storage.token = '';
    this.storage.refreshToken = '';
    this.storage.serverId = '';
    this.user = null;
    this.socket.disconnect();
    this.navCtrl.navigateForward(['/sign-in']);
  }

  public lockBtn(key: string): void {
    this.btnLoading.push(key);
  }

  public unlockBtn(key: string): void {
    setTimeout(() => {
      this.btnLoading = this.btnLoading.filter(el => el !== key);
    }, 200);
  }

  public isBtnLoading(key: string): boolean {
    return this.btnLoading.includes(key);
  }

  public getDevices(event: any = null): void {
    const complete = () => {
      if (event) {
        event.target.complete();
      }
    };
    if (this.storage.serverId) {
      this.backend
        .getDevices()
        .pipe(
          finalize(() => {
            this.loading.dismissLoading();
            complete();
          })
        )
        .subscribe((devices: any) => {
          this.devices = new DevicesModel(devices);
          this.getDeviceValues();
          // console.log(devices);
        });
    } else {
      complete();
    }
  }

  getGateway(next?: () => void): void {
    this.loading.showLoading$(this.backend.getGateway()).subscribe(data => {
      if (data && data.gateway && data.gateway.identifier) {
        this.storage.serverId = data.gateway.identifier;
        this.gateway = data.gateway;
        if (next) {
          next();
        }
      } else {
        if (this.isAuthPage()) {
          this.goStep('add-hub');
        }
      }
    });
  }

  public getDeviceValues() {
    if (this.storage.serverId && this.storage.token) {
      return this.backend.getDeviceValues().pipe(
        finalize(() => {
          this.loading.dismissLoading();
        }),
        switchMap((data: any) => {
          const updateDeviceValues = (values: any) => {
            values.forEach((item: any) => {
              const device = this.devices.items.find(
                item1 => item1.ident === item.ident
              );
              if (device) {
                device.isOnline = item.isOnline;
                device.capabilities.forEach(cap => {
                  cap.value = item.values[`${cap.ident}_${cap.index}`];
                });
              }
            });
          };

          if (data.length !== this.devices?.items?.length) {
            return this.backend.getDevices().pipe(
              finalize(() => {
                updateDeviceValues(data);
              }),
              switchMap((devices: any) => {
                this.devices = new DevicesModel(devices);
                return of(null);
              })
            );
          } else {
            updateDeviceValues(data);
            return of(null);
          }
        })
      );
    } else {
      return of(null);
    }
  }

  public getDrivers(): void {
    this.loading
      .showLoading$(this.backend.drivers())
      .subscribe((drivers: DriverItem[]) => {
        this.drivers = new DriversModel(drivers);
      });
  }

  private isAuthPage(): boolean {
    const currentUrl = this.router.url;
    return (
      currentUrl.includes('sign-up') ||
      currentUrl.includes('sign-in') ||
      currentUrl.includes('main') ||
      currentUrl.includes('auth-redirect') ||
      currentUrl.includes('privacy-policy')
    );
  }

  private async subscribeToNetworkStatus(): Promise<void> {
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
    });
  }

  private subscribeToFocusState(): void {
    App.addListener('appStateChange', state => {
      this.isAppFocused$.next(state.isActive);
    });
  }

  public googleLogin(inviteId?: string): void {
    const encodedState = btoa(JSON.stringify({ inviteId: inviteId }));
    const url = `${environment.main_url}/backend/v2/user/google/login?state=${encodedState}`;
    const browser = this.iab.create(url, '_blank');
    if (this.isMobile) {
      this.handleLogin(browser);
    }
  }

  public appleLogin(inviteId?: string): void {
    // if (this.platform.is('ios')) {
    //   const { response } = await SignInWithApple.authorize({
    //     clientId: 'ai.aydo.app.apple',
    //     scopes: 'email',
    //     redirectURI: 'https://app.test.aydo.ai',
    //   });
    //   const { identityToken } = response;
    // }
    const encodedState = btoa(JSON.stringify({ inviteId: inviteId }));
    const url = `${environment.main_url}/backend/v2/user/apple/login?state=${encodedState}`;
    const browser = this.iab.create(url, '_blank');
    if (this.isMobile) {
      this.handleLogin(browser);
    }
  }

  private handleLogin(browser: any): void {
    browser.on('loadstart').subscribe((event: any) => {
      if (event.url.includes('auth-redirect')) {
        browser.close();
        const urlObj = new URL(event.url);
        const userData = urlObj.searchParams?.get('userData');
        const error = urlObj.searchParams?.get('error');
        if (error) {
          this.errors.showError(decodeURIComponent(error));
          this.router.navigate(['/main']);
          return;
        }
        if (userData) {
          try {
            const decodedData = atob(userData);
            const userTokens = JSON.parse(decodedData);
            const token = userTokens.token;
            const refreshToken = userTokens.refreshToken;

            if (token && refreshToken) {
              this.storage.token = token;
              this.storage.refreshToken = refreshToken;
              this.storage.next();
            } else {
              this.errors.showError('Not authenticated');
            }
          } catch (error) {
            this.errors.showError('Not authenticated');
          }
        } else {
          this.errors.showError('Not authenticated');
        }
        this.afterLogin();
      }
    });
  }
}
