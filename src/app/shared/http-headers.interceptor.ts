import {Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {StorageService} from "../services/storage.service";

@Injectable()
export class HttpHeadersInterceptor implements HttpHeadersInterceptor {

  constructor(public storage: StorageService) {

  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const index = request.url.indexOf('?token=');
    let token: string;
    if (index !== -1) {
      token = request.url.substr(index + 7);
    } else {
      token = this.storage.token;
    }
    const serverId: string = this.storage.serverId;

    if (token) {
      request = request.clone({headers: request.headers.set('Authorization', `Bearer ${token}`)});
    }

    if (serverId) {
      request = request.clone({headers: request.headers.set('Server_ID', serverId)});
    }

    if (!request.headers.has('Content-Type') && request.method !== 'GET') {
      request = request.clone({headers: request.headers.set('Content-Type', 'application/json')});
    }

    request = request.clone({headers: request.headers.set('Accept', 'application/json')});

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        return event;
      }));
  }

}
