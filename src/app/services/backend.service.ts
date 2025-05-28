import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { RequestService } from './request.service';
import {
  LoginItem,
  UserInfo,
  UserItem,
  UserRewards,
} from '../models/users.model';
import { StorageService } from './storage.service';
import { DeviceItem, GatewayItem, ZoneItem } from '../models/gateway.model';
import { between } from '../shared/shared.functions';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ErrorsService } from './errors.service';
import { IDeviceSettings } from '../shared/interfaces/device-settings.interface';
import { WsRequestService } from './ws-request.service';
import {
  IPaginatedResponse,
  IPagination,
} from '../models/pagination.interface';

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

export interface Blockchain {
  id: number;
  name: string;
  keyword: string;
}

export interface SmartContract {
  id: number;
  name: string;
  keyword: string;
  pubkey: string;
  blockchain: Blockchain;
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
    private wsRequest: WsRequestService
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

  userRegister(user: UserItem): Observable<UserInfo> {
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
    return this.wsRequest.post(
      `/backend/v2/user/edit`,
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

  userInfo(): Observable<UserInfo> {
    return this.request.get(`${environment.main_url}/backend/v2/user/info`, {
      mainGroup: 'backend',
      method: 'user-info',
    });
  }

  userRewards(
    pagination: IPagination
  ): Observable<IPaginatedResponse<UserRewards>> {
    return this.wsRequest.post(
      `/backend/v2/user/rewards`,
      { pagination },
      {
        mainGroup: 'backend',
        method: 'user-rewards',
      }
    );
  }

  userRefresh(): Observable<any> {
    return this.wsRequest
      .get(`/backend/v2/user/refresh`, {
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
    return this.wsRequest.post(
      `/backend/v2/gateway/connect`,
      { gateway },
      {
        mainGroup: 'backend',
        method: 'gateway-connect',
      }
    );
  }

  drivers(): Observable<any> {
    return this.wsRequest.get(`/backend/v2/gateway/drivers`, {
      mainGroup: 'backend',
      method: 'gateway-drivers',
    });
  }

  saveDevice(device: DeviceItem): Observable<any> {
    return this.wsRequest.post(
      `/backend/v2/gateway/device`,
      { device },
      {
        mainGroup: 'backend',
        method: 'gateway-save-device',
      }
    );
  }

  getDevices(): Observable<any> {
    return this.wsRequest.get(`/backend/v2/gateway/device`, {
      mainGroup: 'backend',
      method: 'gateway-get-devices',
    });
  }

  deleteDevice(device_ident: string): Observable<any> {
    return this.wsRequest.post(
      `/backend/v2/gateway/device/delete`,
      { data: { device_ident } },
      {
        mainGroup: 'backend',
        method: 'gateway-delete-device',
      }
    );
  }

  updateDevice(device: IDeviceSettings): Observable<any> {
    return this.wsRequest.post(
      `/backend/v2/gateway/device/update`,
      { data: device },
      {
        mainGroup: 'backend',
        method: 'gateway-update-device',
      }
    );
  }

  getDeviceValues(): Observable<any> {
    return this.wsRequest.get(`/backend/v2/gateway/device/values`, {
      mainGroup: 'backend',
      method: 'gateway-get-device-values',
    });
  }

  getGateway(): Observable<any> {
    return this.wsRequest.get(`/backend/v2/gateway`, {
      mainGroup: 'backend',
      method: 'gateway-get-gateway',
    });
  }

  updateGateway(data: any): Observable<any> {
    return this.wsRequest.patch(
      `/backend/v2/gateway`,
      { data },
      {
        mainGroup: 'backend',
        method: 'gateway-update-gateway',
      }
    );
  }

  deleteGateway(): Observable<any> {
    return this.wsRequest.delete(`/backend/v2/gateway/delete`, {
      mainGroup: 'backend',
      method: 'gateway-delete',
    });
  }

  saveZone(zone: ZoneItem): Observable<any> {
    return this.wsRequest.post(
      `/backend/v2/gateway/zone`,
      { zone },
      {
        mainGroup: 'backend',
        method: 'gateway-save-zone',
      }
    );
  }

  getZones(): Observable<any> {
    return this.wsRequest.get(`/backend/v2/gateway/zone`, {
      mainGroup: 'backend',
      method: 'gateway-get-zones',
    });
  }

  deviceCommand(data: any): Observable<any> {
    return this.wsRequest.post(`/backend/v2/gateway/device/command`, data, {
      mainGroup: 'backend',
      method: 'gateway-device-command',
    });
  }

  logout() {
    return this.request.post(
      `${environment.main_url}/backend/v2/user/logout`,
      {},
      {
        mainGroup: 'backend',
        method: 'user-logout',
      }
    );
  }
}
