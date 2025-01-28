import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  finalize,
  Observable,
  of,
  Subscription,
  timer,
} from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  private loaderTimer: Subscription | null = null;

  public get loading$(): Observable<boolean> {
    return this.loadingSubject.asObservable();
  }

  public showLoading$<T>(observable: Observable<T>): Observable<T> {
    this.showLoading();
    return observable.pipe(
      switchMap(data => of(data)),
      finalize(() => this.dismissLoading())
    );
  }

  public showLoading(debounce: number = 500): void {
    if (!this.loaderTimer) {
      this.loaderTimer = timer(debounce).subscribe(() =>
        this.loadingSubject.next(true)
      );
    }
  }

  public dismissLoading(): void {
    setTimeout(() => {
      if (this.loaderTimer) {
        this.loaderTimer.unsubscribe();
        this.loaderTimer = null;
      }
      this.loadingSubject.next(false);
    }, 0);
  }
}
