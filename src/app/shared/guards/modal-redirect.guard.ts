import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { NavigationService } from '../../services/navigation.service';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ModalRedirectGuard implements CanActivate {
  private pathMapping: Record<string, string> = {
    'profile/edit': 'profile-edit',
    'dashboard/rewards': 'rewards',
    'devices/add': 'devices-add',
    'devices/new': 'devices-new',
  };

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const isMobile = await this.navigationService.isMobile$
      .pipe(take(1))
      .toPromise();
    const originalPath = route.routeConfig?.path;
    const idParam = route.params['id'];

    if (originalPath === ':id' && idParam) {
      if (!isMobile) {
        return this.router.createUrlTree([
          { outlets: { modal: `stream/${idParam}` } },
        ]);
      }
      return true;
    }

    if (originalPath === ':id/devices' && idParam) {
      if (!isMobile) {
        return this.router.createUrlTree([
          { outlets: { modal: `stream/${idParam}/devices` } },
        ]);
      }
      return true;
    }

    if (!originalPath) return true;

    if (!isMobile) {
      const newPath = this.pathMapping[originalPath] || originalPath;
      return this.router.createUrlTree([{ outlets: { modal: [newPath] } }]);
    }

    if (this.pathMapping[originalPath]) {
      return this.router.createUrlTree([this.pathMapping[originalPath]]);
    }

    return true;
  }
}
