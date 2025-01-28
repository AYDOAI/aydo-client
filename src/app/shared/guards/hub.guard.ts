import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../../services/storage.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HubGuard implements CanActivate {
  constructor(
    private storage: StorageService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.storage.initSub().pipe(
      map(() => {
        if (!this.storage.serverId) {
          return this.router.createUrlTree(['/add-hub']);
        }
        return true;
      })
    );
  }
}
