import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable, Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private _token!: string;
  private _refreshToken!: string;
  private _serverId!: string;
  private initSubject: Subject<any> = new Subject<any>();

  constructor(private storage: Storage) {
    this.init();
  }

  initSub(): Observable<any> {
    return this.initSubject.asObservable();
  }

  async init() {
    await this.storage.create();
    this._token = await this.getString('token');
    this._refreshToken = await this.getString('refresh_token');
    this._serverId = await this.getString('server_id');
    this.initSubject.next({token: this._token, refreshToken: this._refreshToken});
  }

  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
    this.set('token', value);
  }

  get refreshToken(): string {
    return this._refreshToken;
  }

  set refreshToken(value: string) {
    this._refreshToken = value;
    this.set('refresh_token', value);
  }

  get serverId(): string {
    return this._serverId;
  }

  set serverId(value: string) {
    this._serverId = value;
    this.set('server_id', value);
  }

  getFromStorage(key: string): Promise<string> {
    return this.storage.get(`aydo-${key}`).then((data: any) => {
      return Promise.resolve(data);
    }).catch((error: any) => {
      return Promise.reject(error);
    });
  }

  getString(key: string, defaultValue: string | null = null): Promise<string> {
    return this.getFromStorage(key).then((data: any) => {
      return Promise.resolve(data !== undefined && data !== null ? data : defaultValue);
    }).catch(error => {
      return Promise.reject(error);
    })
  }

  getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    return this.getFromStorage(key).then((data: any) => {
      return Promise.resolve(data !== undefined && data !== null ? data : defaultValue);
    }).catch(error => {
      return Promise.reject(error);
    })
  }

  getObject(key: string): Promise<any> {
    return this.getFromStorage(key).then((data: any) => {
      return Promise.resolve(data);
    }).catch(error => {
      return Promise.reject(error);
    })
  }

  set(key: string, value: string) {
    if (this.storage) {
      this.storage.set(`aydo-${key}`, value);
    }
  }

  delete(key: string) {
    this.storage.remove(`aydo-${key}`);
  }

  setBool(key: string, value: boolean) {
    this.storage.set(`aydo-${key}`, value);
  }

  setObject(key: string, value: object) {
    return this.storage.set(`aydo-${key}`, value);
  }

}
