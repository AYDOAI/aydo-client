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
    'devices/edit': 'device-edit',
    'devices/hub': 'device-hub',
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
    const hubParam = route.params['hub'];
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

    if (originalPath === ':hub' && hubParam) {
      if (!isMobile) {
        return this.router.createUrlTree([
          { outlets: { modal: `add-hub/${hubParam}` } },
        ]);
      }
      return true;
    }

    if (originalPath === ':hub/search/manually' && hubParam) {
      if (!isMobile) {
        return this.router.createUrlTree([
          { outlets: { modal: `add-hub/${hubParam}/search/manually` } },
        ]);
      }
      return true;
    }

    if (originalPath === ':hub/connected' && hubParam) {
      if (!isMobile) {
        return this.router.createUrlTree([
          { outlets: { modal: `add-hub/${hubParam}/connected` } },
        ]);
      }
      return true;
    }

    if (!originalPath) return true;

    if (!isMobile) {
      const newPath = this.pathMapping[originalPath] || originalPath;
      return this.router.createUrlTree([{ outlets: { modal: [newPath] } }]);
    }

    return true;
  }
}
