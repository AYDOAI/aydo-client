import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {RequestService} from './request.service';
import {LoginItem, UserItem} from '../models/users.model';
import {StorageService} from "./storage.service";
import {GatewayItem} from '../models/gateway.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(public request: RequestService,
              public storage: StorageService) {
  }

  userLogin(user: LoginItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/login`, {user}, {mainGroup: 'backend', method: 'user-login'}).then(data => {
      this.storage.set('token', data.user.token);
      this.storage.set('refresh_token', data.user.refresh_token);
      return Promise.resolve(data);
    });
  }

  userRegister(user: UserItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user`, {user}, {mainGroup: 'backend', method: 'user-register'});
  }

  userForgot(user: LoginItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/forgot`, {user}, {mainGroup: 'backend', method: 'user-forgot'});
  }

  userInfo(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/user/info`,  {mainGroup: 'backend', method: 'user-info'});
  }

  userRefresh(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/user/refresh`, {mainGroup: 'backend', method: 'user-refresh'}).then(data => {
      this.storage.set('token', data.user.token);
      this.storage.set('refresh_token', data.user.refresh_token);
      return Promise.resolve(data);
    });
  }

  gatewayConnect(gateway: GatewayItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/gateway/connect`,  {gateway}, {mainGroup: 'backend', method: 'gateway-connect'});
  }

}
