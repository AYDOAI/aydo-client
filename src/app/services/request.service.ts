import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

import {ErrorsService} from './errors.service';
import {environment} from "../../environments/environment";

export interface RequestOptions {
  mainGroup?: string;
  method?: string;
  responseType?: string;
  ignoreError?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  error: any;

  constructor(public http: HttpClient,
              public errors: ErrorsService) {

  }

  get(url: string, opts: RequestOptions | null = null): Promise<any> {
    return this.request('GET', url, null, opts);
  }

  post(url: string, data: object, opts: RequestOptions | null = null): Promise<any> {
    return this.request('POST', url, {...data}, opts);
  }

  put(url: string, data: object, opts: RequestOptions | null = null): Promise<any> {
    return this.request('PUT', url, {...data}, opts);
  }

  del(url: string, opts: RequestOptions | null = null): Promise<any> {
    return this.request('DELETE', url, null, opts);
  }

  request(requestMethod: string, url: string, body: object | null, opts: RequestOptions | null = null): Promise<any> {
    const time = new Date().getTime();
    const mainGroup = opts ? opts.mainGroup : '';
    const method = opts ? opts.method : '';
    const responseType: any = opts && opts.responseType ? opts.responseType : 'json';
    return this.http.request(requestMethod, url, {
      body,
      responseType,
      observe: 'response',
    }).toPromise().then((response: any) => {
      if (response.body) {
        this.errors.logEx(`${requestMethod} ${url}`, mainGroup, 'response', method, response.body, new Date().getTime() - time);
      } else {
        this.errors.logEx(`${requestMethod} ${url}`, mainGroup, 'response', method, response, new Date().getTime() - time);
      }
      return Promise.resolve(response.body);
    }).catch(response => {
      // if (response && response.error && response.error.name === 'TokenExpiredError') {
      //   return this.request('get', `${environment.main_url}/backend/v2/user/refresh`, null, null).then(data => {
      //     console.log(data)
      //     return Promise.resolve(response.body);
      //   }).catch((error) => {
      //     console.log(error)
      //     return Promise.reject(response.error);
      //   })
      // } else {
        let message = '';
        if (response && response.error && response.error.message) {
          message = `${response.error.message}`;
        } else if (response && response.error && response.error.errors) {
          message = `${response.error.errors.message}`;
        } else if (response && response.message) {
          message = `${response.message}`;
        } else {
          message = `${response.status ? `${response.status} ` : ''}${response.statusText}`;
        }
        this.errors.onError(response.error);
        if (!opts || !opts.ignoreError) {
          // message += ` (${url})`;
          console.log(`${response.status} ${response.statusText} (${url})`);
          this.errors.onException({
            type: 'error',
            message
          });
        }
        if (response.error && !response.error.errors) {
          response.error.errors = {message};
        }
        this.errors.logEx(`${requestMethod} ${url}`, mainGroup, 'response', method, response.body,
          new Date().getTime() - time, response.error);
        return Promise.reject(response.error);
      // }
    });
  }

}
