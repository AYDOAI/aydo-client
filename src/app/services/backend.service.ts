import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {RequestService} from './request.service';
import {LoginItem, UserItem} from '../models/users.model';
import {StorageService} from "./storage.service";

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(public request: RequestService,
              public storage: StorageService) {
  }

  userLogin(user: LoginItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/login`, {user}, {mainGroup: 'backend', method: 'login'}).then(data => {
      this.storage.set('token', data.user.token);
      this.storage.set('refresh_token', data.user.refresh_token);
      return Promise.resolve(data);
    });
  }

  userRegister(user: UserItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user`, {user}, {mainGroup: 'backend', method: 'register'});
  }

  userForgot(user: LoginItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/forgot`, {user}, {mainGroup: 'backend', method: 'forgot'});
  }

  userInfo(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/user/info`,  {mainGroup: 'backend', method: 'info'});
  }

  userRefresh(): Promise<any> {
    return this.request.get(`${environment.main_url}/backend/v2/user/refresh`, {mainGroup: 'backend', method: 'refresh'}).then(data => {
      this.storage.set('token', data.user.token);
      this.storage.set('refresh_token', data.user.refresh_token);
      return Promise.resolve(data);
    });
  }

}
