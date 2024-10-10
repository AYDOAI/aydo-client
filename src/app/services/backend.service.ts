import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {RequestService} from './request.service';
import {LoginItem, UserItem} from '../models/users.model';
import {StorageService} from './storage.service';
import {DeviceItem, GatewayItem} from '../models/gateway.model';
import {between} from '../shared/shared.functions';
import detectEthereumProvider from '@metamask/detect-provider';
import {from, tap} from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ErrorsService } from "./errors.service";

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
  title: string;
  description: string;
  status: 'Active' | 'Pending' | 'Not Active';
}

export interface DataStreams {
  items: DataStream[];
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
      tokens: 120.00,
      history: [{value: 40, type: 'tokens'}, {value: 15, type: 'points'}]
    },
    {
      multiplier: 1.3,
      points: 15.54,
      tokens: 60.00,
      history: [{value: 25, type: 'points'}, {value: 50, type: 'tokens'}]
    },
    {
      multiplier: 1.2,
      points: 9.68,
      tokens: 200.00,
      history: [{value: 60, type: 'tokens'}, {value: -25, type: 'points'}]
    },
  ];
  mainQuests: Quests[] = [
    {
      items: [
        {title: 'Install the sensor', reward: 40, type: 'tokens'},
        {title: 'Log in to the app for 30 days', reward: 30, type: 'tokens'},
        {title: 'Invite your friend', reward: 50, type: 'points'}
      ]
    },
    {items: []},
    {
      items: [
        {title: 'Install the sensor', reward: 40, type: 'tokens'},
        {title: 'Log in to the app for 30 days', reward: 30, type: 'tokens'},
        {title: 'Invite your friend', reward: 50, type: 'points'}
      ]
    },
  ];
  additionalQuests: Quests[] = [
    {items: []},
    {
      items: [
        {title: 'Install the sensor', reward: 40, type: 'tokens'},
        {title: 'Log in to the app for 30 days', reward: 30, type: 'tokens'},
        {title: 'Invite your friend', reward: 50, type: 'points'}
      ]
    },
    {
      items: [
        {title: 'Install the sensor', reward: 40, type: 'tokens'},
        {title: 'Log in to the app for 30 days', reward: 30, type: 'tokens'},
        {title: 'Invite your friend', reward: 50, type: 'points'}
      ]
    }
  ];
  rankings: Ranking[] = [
    {title: 'Senior'},
    {title: 'Expert'},
    {title: 'Junior'},
  ];
  dataStreams: DataStreams = {
    items: [
      {title: 'Project #1', description: 'Project for blockchain elite reward', status: 'Active'},
      {title: 'Project #2', description: 'Project for blockchain elite reward', status: 'Pending'},
      {title: 'Project #3', description: 'Project for blockchain elite reward', status: 'Not Active'},
      {title: 'Project #4', description: 'Project for blockchain elite reward', status: 'Active'},
      {title: 'Project #5', description: 'Project for blockchain elite reward', status: 'Pending'},
      {title: 'Project #6', description: 'Project for blockchain elite reward', status: 'Not Active'},
    ]
  };

  constructor(public request: RequestService,
              public storage: StorageService,
              public errors: ErrorsService) {
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

  getDataStreams(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve(this.dataStreams);
    });
  }

  public signInWithMetaMask() {
    let ethereum: any;

    return from(detectEthereumProvider()).pipe(
      switchMap(async (provider) => {
        if (!provider) {
          this.errors.showError('Please install MetaMask');
          throw new Error('Please install MetaMask');
        }
        ethereum = provider;
        return await ethereum.request({ method: 'eth_requestAccounts' });
      }),
      switchMap(() => this.metamaskGetNonce(ethereum.selectedAddress)),
      switchMap(
        async (response) =>
          await ethereum.request({
            method: 'personal_sign',
            params: [
              `0x${this.toHex(response.nonce)}`,
              ethereum.selectedAddress,
            ],
          })
      ),
      switchMap((sig) => this.metamaskVerifySignedMessage(ethereum.selectedAddress, sig)),
      switchMap(
        async (response) => {
          this.storage.token = response.user.token;
          this.storage.refreshToken = response.user.refresh_token;
        }
      )
    );
  }

  private toHex(stringToConvert: string) {
    return stringToConvert
      .split('')
      .map((c) => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  metamaskGetNonce(address: any): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/metamask/get-nonce`, {address}, {
      mainGroup: 'backend',
      method: 'metamask-get-nonce'
    }).then(data => {
      return Promise.resolve(data);
    });
  }

  metamaskVerifySignedMessage(address: any, sig: any): Promise<any> {
    const data = {address:address, sig: sig}
    return this.request.post(`${environment.main_url}/backend/v2/user/metamask/verify`, {data}, {
      mainGroup: 'backend',
      method: 'metamask-verify-signed-message'
    }).then(data => {
      return Promise.resolve(data);
    });
  }

}
