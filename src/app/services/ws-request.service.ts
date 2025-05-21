import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, filter, first } from 'rxjs/operators';
import { SocketService } from './socket.service';
import { StorageService } from './storage.service';
import { ErrorsService } from './errors.service';

interface ApiRequest {
  method: string;
  url: string;
  headers?: { [key: string]: string };
  body?: any;
  mainGroup?: string;
  methodName?: string;
  responseType?: string;
  ignoreError?: boolean;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  requestId?: string;
}

@Injectable({ providedIn: 'root' })
export class WsRequestService {
  private requestCounter = 0;

  constructor(
    private socketService: SocketService,
    private storage: StorageService,
    private errors: ErrorsService
  ) {}

  private sendRequest<T>(request: ApiRequest): Observable<T> {
    request.headers = this.addAuthHeader(request.headers);
    const requestId = `req_${this.requestCounter++}`;
    const time = new Date().getTime();

    return new Observable<T>(observer => {
      const subscription = this.socketService
        .on<ApiResponse>('api_response')
        .pipe(
          filter(response => response.requestId === requestId),
          first()
        )
        .subscribe({
          next: response => {
            if (response.success) {
              observer.next(response.data);
            } else {
              if (!request.ignoreError) {
                this.handleError(response.data, request, time);
              }
            }
            observer.complete();
          },
          error: err => {
            if (!request.ignoreError) {
              this.handleError(err, request, time);
            }
            observer.complete();
          },
        });

      this.socketService.send('api_request', {
        ...request,
        requestId,
      });

      return () => subscription.unsubscribe();
    }).pipe(
      catchError(err => {
        this.handleError(err, request, time);
        return throwError(() => new Error(err));
      })
    );
  }

  public get<T>(
    url: string,
    headers?: { [key: string]: string },
    opts?: {
      mainGroup?: string;
      method?: string;
      responseType?: string;
      ignoreError?: boolean;
    }
  ): Observable<T> {
    return this.sendRequest<T>({
      method: 'GET',
      url,
      headers,
      ...opts,
    });
  }

  public post<T>(
    url: string,
    body: any,
    headers?: { [key: string]: string },
    opts?: {
      mainGroup?: string;
      method?: string;
      responseType?: string;
      ignoreError?: boolean;
    }
  ): Observable<T> {
    return this.sendRequest<T>({
      method: 'POST',
      url,
      headers,
      body,
      ...opts,
    });
  }

  public put<T>(
    url: string,
    body: any,
    headers?: { [key: string]: string },
    opts?: {
      mainGroup?: string;
      method?: string;
      responseType?: string;
      ignoreError?: boolean;
    }
  ): Observable<T> {
    return this.sendRequest<T>({
      method: 'PUT',
      url,
      headers,
      body,
      ...opts,
    });
  }

  public delete<T>(
    url: string,
    headers?: { [key: string]: string },
    opts?: {
      mainGroup?: string;
      method?: string;
      responseType?: string;
      ignoreError?: boolean;
    }
  ): Observable<T> {
    return this.sendRequest<T>({
      method: 'DELETE',
      url,
      headers,
      ...opts,
    });
  }

  public patch<T>(
    url: string,
    body: any,
    headers?: { [key: string]: string },
    opts?: {
      mainGroup?: string;
      method?: string;
      responseType?: string;
      ignoreError?: boolean;
    }
  ): Observable<T> {
    return this.sendRequest<T>({
      method: 'PATCH',
      url,
      headers,
      body,
      ...opts,
    });
  }

  private addAuthHeader(headers?: { [key: string]: string }): {
    [key: string]: string;
  } {
    const token = this.storage.token;
    if (token) {
      return {
        ...headers,
        authorization: `Bearer ${token}`,
      };
    }
    return headers || {};
  }

  private handleError(
    error: any,
    request: ApiRequest,
    startTime: number
  ): void {
    const requestMethod = request.method;
    const url = request.url;
    const mainGroup = request.mainGroup || '';
    const methodName = request.methodName || '';
    const ignoreError = request.ignoreError || false;

    if (error.status === 0) {
      this.errors.showError(
        'There was an error connecting. Please check your internet connection and try again later.'
      );
      return;
    }

    let message = '';
    if (error && error.message) {
      message = `${error.message}`;
    } else if (error && error.errors) {
      message = `${error.errors.message}`;
    } else {
      message = `${error.status ? `${error.status} ` : ''}${error.statusText}`;
    }

    if (!error.message) {
      error.message = message;
    }

    if (!ignoreError) {
      this.errors.onError(error);
      console.log(`${error.status} ${error.statusText} (${url})`);
    }

    if (error && !error.errors) {
      error.errors = { message };
    }

    this.errors.logEx(
      `${requestMethod} ${url}`,
      mainGroup,
      'response',
      methodName,
      error,
      new Date().getTime() - startTime,
      error
    );
  }
}
