import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {RequestService} from './request.service';
import {LoginItem, UserItem} from '../models/users.model';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(public request: RequestService) {
  }

  login(user: LoginItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user/login`, {user}, {mainGroup: 'backend', method: 'login'});
  }

  register(user: UserItem): Promise<any> {
    return this.request.post(`${environment.main_url}/backend/v2/user`, {user}, {mainGroup: 'backend', method: 'register'});
  }

}
