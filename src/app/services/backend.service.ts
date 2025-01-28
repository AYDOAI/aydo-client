import { Injectable } from '@angular/core';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { Platform } from '@ionic/angular';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { RequestService } from './request.service';
import { LoginItem, UserItem } from '../models/users.model';
import { StorageService } from './storage.service';
import { DeviceItem, GatewayItem, ZoneItem } from '../models/gateway.model';
import { between } from '../shared/shared.functions';
import detectEthereumProvider from '@metamask/detect-provider';
import { from, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ErrorsService } from './errors.service';
import { IDeviceSettings } from '../shared/interfaces/device-settings.interface';

export interface Notification {
  title?: string;
}

export interface Notifications {
  items: Notification[];
}

export interface RewardHistory {
  value: number;
  type: 'tokens' | 'points';
}

export interface Reward {
  multiplier: number;
  points: number;
  tokens: number;
  history: RewardHistory[];
}

export interface Quest {
  title: string;
  reward: number;
  type: 'tokens' | 'points';
}

export interface Quests {
  items: Quest[];
}

export interface Ranking {
  title: string;
}

export interface DataStream {
  id: number;
  name: string;
  description: string;
  externalLink: string;
  status?: 0 | 1;
  logo?: string;
}

export interface DataStreams {
  items: DataStream[];
}

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  randomIndex = 0;
  notifications: Notifications[] = [
    {
      items: [],
    },
    {
      items: [{ title: 'New project available' }],
    },
    {
      items: [
        { title: 'New project available' },
        { title: 'New reward acquired' },
      ],
    },
  ];
  rewards: Reward[] = [
    {
      multiplier: 1.1,
      points: 10.01,
      tokens: 120.0,
      history: [
        { value: 40, type: 'tokens' },
        { value: 15, type: 'points' },
      ],
    },
    {
      multiplier: 1.3,
      points: 15.54,
      tokens: 60.0,
      history: [
        { value: 25, type: 'points' },
        { value: 50, type: 'tokens' },
      ],
    },
    {
      multiplier: 1.2,
      points: 9.68,
      tokens: 200.0,
      history: [
        { value: 60, type: 'tokens' },
        { value: -25, type: 'points' },
      ],
    },
  ];
  mainQuests: Quests[] = [
    {
      items: [
        { title: 'Install the sensor', reward: 40, type: 'tokens' },
        { title: 'Log in to the app for 30 days', reward: 30, type: 'tokens' },
        { title: 'Invite your friend', reward: 50, type: 'points' },
      ],
    },
    { items: [] },
    {
      items: [
        { title: 'Install the sensor', reward: 40, type: 'tokens' },
        { title: 'Log in to the app for 30 days', reward: 30, type: 'tokens' },
        { title: 'Invite your friend', reward: 50, type: 'points' },
      ],
    },
  ];
  additionalQuests: Quests[] = [
    { items: [] },
    {
      items: [
        { title: 'Install the sensor', reward: 40, type: 'tokens' },
        { title: 'Log in to the app for 30 days', reward: 30, type: 'tokens' },
        { title: 'Invite your friend', reward: 50, type: 'points' },
      ],
    },
    {
      items: [
        { title: 'Install the sensor', reward: 40, type: 'tokens' },
        { title: 'Log in to the app for 30 days', reward: 30, type: 'tokens' },
        { title: 'Invite your friend', reward: 50, type: 'points' },
      ],
    },
  ];
  rankings: Ranking[] = [
    { title: 'Senior' },
    { title: 'Expert' },
    { title: 'Junior' },
  ];

  constructor(
    public request: RequestService,
    public storage: StorageService,
    public errors: ErrorsService,
    private iab: InAppBrowser,
    private platform: Platform,
    private router: Router
  ) {
    this.randomIndex = between(0, 2);
  }

  userLogin(user: LoginItem): Observable<any> {
    return this.request
      .post(
        `${environment.main_url}/backend/v2/user/login`,
        { user },
        {
          mainGroup: 'backend',
          method: 'user-login',
        }
      )
      .pipe(
        tap(data => {
          this.storage.token = data.user.token;
          this.storage.refreshToken = data.user.refresh_token;
        })
      );
  }

  demoLogin(): Observable<any> {
    return this.request
      .post(
        `${environment.main_url}/backend/v2/user/login`,
        { user: { login: 'test@aydo.ai', password: '1qaz@WSX' } },
        {
          mainGroup: 'backend',
          method: 'demo-login',
          ignoreError: true,
        }
      )
      .pipe(
        tap(data => {
          this.storage.token = data.user.token;
          this.storage.refreshToken = data.user.refresh_token;
        })
      );
  }

  userRegister(user: UserItem): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/user`,
      { user },
      {
        mainGroup: 'backend',
        method: 'user-register',
      }
    );
  }

  updateUser(user: any): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/user/edit`,
      { user },
      {
        mainGroup: 'backend',
        method: 'user-update',
      }
    );
  }

  userForgot(user: LoginItem): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/user/forgot`,
      { user },
      {
        mainGroup: 'backend',
        method: 'user-forgot',
      }
    );
  }

  resendCode(): Observable<any> {
    return this.request.get(
      `${environment.main_url}/backend/v2/user/resend-code`,
      {
        mainGroup: 'backend',
        method: 'resend-code',
      }
    );
  }

  userInfo(): Observable<any> {
    return this.request.get(`${environment.main_url}/backend/v2/user/info`, {
      mainGroup: 'backend',
      method: 'user-info',
    });
  }

  userRefresh(): Observable<any> {
    return this.request
      .get(`${environment.main_url}/backend/v2/user/refresh`, {
        mainGroup: 'backend',
        method: 'user-refresh',
      })
      .pipe(
        tap(data => {
          this.storage.set('token', data.user.token);
          this.storage.set('refresh_token', data.user.refresh_token);
          return Promise.resolve(data);
        })
      );
  }

  gatewayConnect(gateway: GatewayItem): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/gateway/connect`,
      { gateway },
      {
        mainGroup: 'backend',
        method: 'gateway-connect',
      }
    );
  }

  drivers(): Observable<any> {
    return this.request.get(
      `${environment.main_url}/backend/v2/gateway/drivers`,
      {
        mainGroup: 'backend',
        method: 'gateway-drivers',
      }
    );
  }

  saveDevice(device: DeviceItem): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/gateway/device`,
      { device },
      {
        mainGroup: 'backend',
        method: 'gateway-save-device',
      }
    );
  }

  getDevices(): Observable<any> {
    return this.request.get(
      `${environment.main_url}/backend/v2/gateway/device`,
      {
        mainGroup: 'backend',
        method: 'gateway-get-devices',
      }
    );
  }

  deleteDevice(device_ident: string): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/gateway/device/delete`,
      { data: { device_ident } },
      {
        mainGroup: 'backend',
        method: 'gateway-delete-device',
      }
    );
  }

  updateDevice(device: IDeviceSettings): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/gateway/device/update`,
      { data: device },
      {
        mainGroup: 'backend',
        method: 'gateway-update-device',
      }
    );
  }

  getDeviceValues(): Observable<any> {
    return this.request.get(
      `${environment.main_url}/backend/v2/gateway/device/values`,
      {
        mainGroup: 'backend',
        method: 'gateway-get-device-values',
      }
    );
  }

  getGateway(): Observable<any> {
    return this.request.get(`${environment.main_url}/backend/v2/gateway`, {
      mainGroup: 'backend',
      method: 'gateway-get-gateway',
    });
  }

  saveZone(zone: ZoneItem): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/gateway/zone`,
      { zone },
      {
        mainGroup: 'backend',
        method: 'gateway-save-zone',
      }
    );
  }

  getZones(): Observable<any> {
    return this.request.get(`${environment.main_url}/backend/v2/gateway/zone`, {
      mainGroup: 'backend',
      method: 'gateway-get-zones',
    });
  }

  deviceCommand(data: any): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/gateway/device/command`,
      data,
      {
        mainGroup: 'backend',
        method: 'gateway-device-command',
      }
    );
  }

  getNotifications(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.notifications[this.randomIndex]);
    });
  }

  getRewards(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.rewards[this.randomIndex]);
    });
  }

  getMainQuests(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.mainQuests[this.randomIndex]);
    });
  }

  getAdditionalQuests(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.additionalQuests[this.randomIndex]);
    });
  }

  getRanking(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.rankings[this.randomIndex]);
    });
  }

  getDataStreams(): Observable<DataStream[]> {
    return this.request.get(`${environment.main_url}/backend/v2/data-stream`, {
      mainGroup: 'backend',
      method: 'data-streams',
    });
  }

  getDataStreamById(id: number): Observable<DataStream> {
    return this.request.get(
      `${environment.main_url}/backend/v2/data-stream/${id}`,
      {
        mainGroup: 'backend',
        method: 'data-stream',
      }
    );
  }

  toggleDataStream(id: number): Observable<{ status: number }> {
    return this.request.post(
      `${environment.main_url}/backend/v2/data-stream/${id}/toggle`,
      {},
      {
        mainGroup: 'backend',
        method: 'data-stream-toggle',
      }
    );
  }

  public googleLogin(inviteId?: string): void {
    const encodedState = btoa(JSON.stringify({ inviteId: inviteId }));
    const url = `${environment.main_url}/backend/v2/user/google/login?state=${encodedState}`;
    const browser = this.iab.create(url);
    if (this.platform.is('capacitor')) {
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
    const browser = this.iab.create(url);
    if (this.platform.is('capacitor')) {
      this.handleLogin(browser);
    }
  }

  private handleLogin(browser: any): void {
    browser.on('loadstart').subscribe((event: any) => {
      if (event.url.includes('auth-redirect')) {
        browser.close();
        const urlObj = new URL(event.url);
        const userData = urlObj.searchParams?.get('userData');
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
      }
    });
  }

  public signInWithMetaMask(inviteId: string) {
    let ethereum: any;

    return from(detectEthereumProvider()).pipe(
      switchMap(async provider => {
        if (!provider) {
          throw new Error('Please install MetaMask');
        }
        ethereum = provider;
        return await ethereum.request({ method: 'eth_requestAccounts' });
      }),
      switchMap(() =>
        this.metamaskGetNonce(ethereum.selectedAddress, inviteId)
      ),
      switchMap(
        async response =>
          await ethereum.request({
            method: 'personal_sign',
            params: [
              `0x${this.toHex(response.nonce)}`,
              ethereum.selectedAddress,
            ],
          })
      ),
      switchMap(sig =>
        this.metamaskVerifySignedMessage(ethereum.selectedAddress, sig)
      ),
      switchMap(async response => {
        this.storage.token = response.user.token;
        this.storage.refreshToken = response.user.refresh_token;
        this.storage.next();
      })
    );
  }

  private toHex(stringToConvert: string) {
    return stringToConvert
      .split('')
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  metamaskGetNonce(address: any, inviteId: string): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/user/metamask/get-nonce`,
      { address, inviteId },
      {
        mainGroup: 'backend',
        method: 'metamask-get-nonce',
        ignoreError: true,
      }
    );
  }

  metamaskVerifySignedMessage(address: any, sig: any): Observable<any> {
    const data = { address: address, sig: sig };
    return this.request.post(
      `${environment.main_url}/backend/v2/user/metamask/verify`,
      { data },
      {
        mainGroup: 'backend',
        method: 'metamask-verify-signed-message',
      }
    );
  }
}
