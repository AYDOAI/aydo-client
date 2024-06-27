import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage';


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  token!: string;
  refresh_token!: string;

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    await this.storage.create();
    this.getString('token').then((data: any) => {
      this.token = data;
    });
    this.getString('refresh_token').then((data: any) => {
      this.refresh_token = data;
    });
  }

  getString(key: string, defaultValue: string | null = null): Promise<string> {
    return new Promise((resolve, reject) => {
      const value = localStorage.getItem(`aydo-${key}`);
      if (value) {
        localStorage.removeItem(`aydo-${key}`);
        this.storage.set(key, value);
        resolve(value );
      } else {
        this.storage.get(key).then((data: any) => {
          resolve(data !== undefined && data !== null ? data : defaultValue);
        }).catch((error: any) => {
          reject(error);
        });
      }
    });
  }

  getBoolean(key: string, defaultValue: boolean = false): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const value = localStorage.getItem(`aydo-${key}`);
      if (value) {
        localStorage.removeItem(`aydo-${key}`);
        this.storage.set(key, value === 'true');
        resolve(value === 'true');
      } else {
        this.storage.get(key).then((data: any) => {
          resolve(data);
        }).catch((error: any) => {
          reject(error);
        });
      }
    });
  }

  getObject(key: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let value = localStorage.getItem(`aydo-${key}`);
      if (value) {
        try {
          value = JSON.parse(value);
          localStorage.removeItem(`aydo-${key}`);
          this.storage.set(key, value);
          resolve(value);
        } catch (e) {
          resolve(null);
        }
      } else {
        this.storage.get(key).then((data: any) => {
          resolve(data);
        }).catch((error: any) => {
          reject(error);
        });
      }
    });
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
