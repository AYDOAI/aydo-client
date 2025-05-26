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
    'zone/add': 'add-zone',
  };

  private dynamicRoutePatterns = [
    {
      pattern: /^:id$/,
      paramName: 'id',
      modalPath: (id: string) => `stream/${id}`,
    },
    {
      pattern: /^:id\/invitation$/,
      paramName: 'id',
      modalPath: (id: string) => `stream/${id}/invitation`,
    },
    {
      pattern: /^:id\/devices$/,
      paramName: 'id',
      modalPath: (id: string) => `stream/${id}/devices`,
    },
    {
      pattern: /^:hub$/,
      paramName: 'hub',
      modalPath: (hub: string) => `add-hub/${hub}`,
    },
    {
      pattern: /^:hub\/search\/manually$/,
      paramName: 'hub',
      modalPath: (hub: string) => `add-hub/${hub}/search/manually`,
    },
    {
      pattern: /^:hub\/connected$/,
      paramName: 'hub',
      modalPath: (hub: string) => `add-hub/${hub}/connected`,
    },
  ];

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  async canActivate(route: ActivatedRouteSnapshot): Promise<boolean | UrlTree> {
    const isMobile = await this.navigationService.isMobile$
      .pipe(take(1))
      .toPromise();

    if (isMobile) {
      return true;
    }

    const originalPath = route.routeConfig?.path;
    if (!originalPath) {
      return true;
    }

    const dynamicRoute = this.findDynamicRoute(originalPath, route.params);
    if (dynamicRoute) {
      return this.router.createUrlTree([{ outlets: { modal: dynamicRoute } }]);
    }

    const staticModalPath = this.pathMapping[originalPath] || originalPath;
    return this.router.createUrlTree([
      { outlets: { modal: [staticModalPath] } },
    ]);
  }

  private findDynamicRoute(path: string, params: any): string | null {
    for (const routePattern of this.dynamicRoutePatterns) {
      if (routePattern.pattern.test(path)) {
        const paramValue = params[routePattern.paramName];
        if (paramValue) {
          return routePattern.modalPath(paramValue);
        }
      }
    }
    return null;
  }
}
