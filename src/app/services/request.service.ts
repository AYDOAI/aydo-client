import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ErrorsService} from './errors.service';

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

      if (response.status === 0) {
        this.errors.showError('There was an error connecting. Please check your internet connection and try again later.');
        return Promise.reject(response.error);
      }

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
        if (!response.error.message) {
          response.error.message = message;
        }
        if (!opts || !opts.ignoreError) {
          this.errors.onError(response.error);
          console.log(`${response.status} ${response.statusText} (${url})`);
        }
        if (response.error && !response.error.errors) {
          response.error.errors = {message};
        }
        this.errors.logEx(`${requestMethod} ${url}`, mainGroup, 'response', method, response.body,
          new Date().getTime() - time, response.error);
        return Promise.reject(response.error);
    });
  }

}
