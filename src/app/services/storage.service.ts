import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';
import {Observable, Subject} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  token!: string;
  refreshToken!: string;
  serverId!: string;
  private initSubject: Subject<any> = new Subject<any>();

  constructor(private storage: Storage) {
    this.init();
  }

  initSub(): Observable<any> {
    return this.initSubject.asObservable();
  }

  async init() {
    await this.storage.create();
    this.token = await this.getString('token');
    this.refreshToken = await this.getString('refresh_token');
    this.initSubject.next({token: this.token, refreshToken: this.refreshToken});
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
