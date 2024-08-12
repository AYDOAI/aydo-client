import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {RequestService} from './request.service';
import {LoginItem, UserItem} from '../models/users.model';
import {StorageService} from './storage.service';
import {DeviceItem, GatewayItem} from '../models/gateway.model';
import {between} from '../shared/shared.functions';

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
}

export interface Quests {
  items: Quest[];
}

export interface Ranking {
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  randomIndex = 0;
  notifications: Notifications[] = [
    {
      items: []
    },
    {
      items: [{title: 'New project available'}]
    },
    {
      items: [{title: 'New project available'}, {title: 'New reward acquired'}]
    },
  ];
  rewards: Reward[] = [
    {
      multiplier: 1.1,
      points: 10.01,
      tokens: 120.00
    },
    {
      multiplier: 1.3,
      points: 15.54,
      tokens: 60.00
    },
    {
      multiplier: 1.2,
      points: 9.68,
      tokens: 200.00
    },
  ];
  mainQuests: Quests[] = [
    {items: []},
    {items: [{}, {}, {}]},
    {items: [{}, {}, {}, {}]},
  ];
  additionalQuests: Quests[] = [
    {items: [{}, {}, {}]},
    {items: []},
    {items: [{}, {}, {}, {}]},
  ];
  rankings: Ranking[] = [
    {title: 'Senior'},
    {title: 'Expert'},
    {title: 'Junior'},
  ];

  constructor(public request: RequestService,
              public storage: StorageService) {
    this.randomIndex = between(0, 2);
  }

  userLogin(user: LoginItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/login`, {user}, {
      mainGroup: 'backend',
      method: 'user-login'
    }).then(data => {
      this.storage.token = data.user.token;
      this.storage.refreshToken = data.user.refresh_token;
      return Promise.resolve(data);
    });
  }

  userRegister(user: UserItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user`, {user}, {
      mainGroup: 'backend',
      method: 'user-register'
    });
  }

  userForgot(user: LoginItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/forgot`, {user}, {
      mainGroup: 'backend',
      method: 'user-forgot'
    });
  }

  userInfo(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/user/info`, {
      mainGroup: 'backend',
      method: 'user-info'
    });
  }

  userRefresh(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/user/refresh`, {
      mainGroup: 'backend',
      method: 'user-refresh'
    }).then(data => {
      this.storage.set('token', data.user.token);
      this.storage.set('refresh_token', data.user.refresh_token);
      return Promise.resolve(data);
    });
  }

  gatewayConnect(gateway: GatewayItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/gateway/connect`, {gateway}, {
      mainGroup: 'backend',
      method: 'gateway-connect'
    });
  }

  drivers(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/gateway/drivers`, {
      mainGroup: 'backend',
      method: 'gateway-drivers'
    });
  }

  saveDevice(device: DeviceItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/gateway/device`, {device}, {
      mainGroup: 'backend',
      method: 'gateway-save-device'
    });
  }

  getDevices(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/gateway/device`, {
      mainGroup: 'backend',
      method: 'gateway-get-devices'
    });
  }

  getDeviceValues(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/gateway/device/values`, {
      mainGroup: 'backend',
      method: 'gateway-get-device-values'
    });
  }

  getGateway(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/gateway`, {
      mainGroup: 'backend',
      method: 'gateway-get-gateway'
    });
  }

  deviceCommand(data: any): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/gateway/device/command`, data, {
      mainGroup: 'backend',
      method: 'gateway-device-command'
    });
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

}
