import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  public showLoading$<T>(observable: Observable<T>): Observable<T> {
    this.loadingSubject.next(true);
    return observable.pipe(
      switchMap((data) => of(data)),
      finalize(() => this.loadingSubject.next(false))
    );
  }

  public showLoading(): void {
    this.loadingSubject.next(true);
  }

  public dismissLoading(): void {
    setTimeout(() => this.loadingSubject.next(false), 0);
  }
}
