import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {DatePipe} from '@angular/common';

import {environment} from '../../environments/environment';
import {jsonStringify} from "../shared/shared.functions";

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  messages: any[] = [];
  datePipe;

  private exceptionSubject: Subject<any> = new Subject<any>();
  private errorSubject: Subject<any> = new Subject<any>();
  private showErrorSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.datePipe = new DatePipe('en-US');
  }

  onException(message: any) {
    this.exceptionSubject.next(message);
  }

  onError(message: any) {
    this.errorSubject.next(message);
  }

  showError(message: any) {
    this.showErrorSubject.next({message, error: true});
  }

  showInfo(message: any) {
    this.showErrorSubject.next({message, info: true});
  }

  exceptionSub(): Observable<any> {
    return this.exceptionSubject.asObservable();
  }

  errorSub(): Observable<any> {
    return this.errorSubject.asObservable();
  }

  showErrorSub(): Observable<any> {
    return this.showErrorSubject.asObservable();
  }

  log(message?: any, ...optionalParams: any[]) {
    let result = '';
    for (let i = 0; i < arguments.length; i++) {
      const msg = typeof arguments[i] === 'object' ? jsonStringify(arguments[i], null, 2) : arguments[i];
      result += `${result ? ' ' : ''}${msg}`;
    }
    this.log1(result);
  }

  log1(message: string, error = false) {
    if (!environment.production || error) {
      console.log(this.datePipe.transform(new Date(), 'HH:mm:ss'), message);
    }
    this.messages.unshift({message: `${this.datePipe.transform(new Date(), 'HH:mm:ss')} ${message}`, error});
    if (this.messages.length > 100) {
      this.messages.splice(100, this.messages.length - 100);
    }
  }

  error(message: string) {
    this.log1(message, true);
  }

  logEx(message: any, mainGroup: string | null = null, group: string | null = null, method: string | null = null, body: any = null, time: number | null = null, error: any = null) {
    if (typeof message === 'object') {
      message = jsonStringify(message);
    }
    if (body && typeof body === 'object') {
      body = jsonStringify(body);
    }
    if (mainGroup || group || method) {
      let config: any = environment.log;
      if (config && mainGroup) {
        config = config[mainGroup];
      }
      if (config && group) {
        config = config[group];
      }
      if (config && method) {
        config = config[method];
      }
      if (!config) {
        if (!error && (typeof config === 'boolean' && !config) || environment.production) {
          return;
        }
      }

      if (body && (!config || typeof config !== 'object' || (typeof config === 'object' && config['body']))) {
        message += '' + body;
      } else if (body) {
        message += '' + body.length;
      }

      if (method) {
        message = `${method}: ${message}`;
      }
      if (group) {
        message = `${group}: ${message}`;
      }
      if (mainGroup) {
        message = `${mainGroup}: ${message}`;
      }
    } else {
      if (body) {
        message += '' + body;
      }
    }

    if (time) {
      message = `(${time} ms) ${message}`;
    }
    if (error) {
      if (error.code) {
        message += ` ${error.code}`;
      }
      if (error.message) {
        message += ` ${error.message}`;
      }
      if (error.statusCode) {
        message += ` ${error.statusCode}`;
      }
      if (error.statusMessage) {
        message += ` ${error.statusMessage}`;
      }
      this.log(message);
    } else {
      this.log(message);
    }
  }

}
