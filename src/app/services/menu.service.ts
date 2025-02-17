import { Injectable } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { NavigationStart, Router } from '@angular/router';
import { BehaviorSubject, filter, map, startWith, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  public menuActive = false;
  private swipeEnabledSubject = new BehaviorSubject<boolean>(true);
  swipeEnabled$ = this.swipeEnabledSubject.asObservable();

  private disableSwipeRoutes = [
    '/sign-in',
    '/sign-up',
    '/forgot-password',
    '/success',
    'privacy-policy',
  ];

  constructor(
    private menuCtrl: MenuController,
    private router: Router
  ) {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        ),
        startWith({ url: this.router.url } as NavigationStart),
        tap(() => {
          this.closeMenus();
        }),
        map(
          (event: NavigationStart) =>
            !this.disableSwipeRoutes.includes(event.url)
        )
      )
      .subscribe(enabled => {
        this.swipeEnabledSubject.next(enabled);
      });
  }

  async toggleMenu(): Promise<void> {
    const menus = await this.menuCtrl.getMenus();
    if (menus && menus.length > 0) {
      const lastMenu = menus[menus.length - 1];
      await lastMenu.toggle();
    }
  }

  async closeMenus(): Promise<void> {
    this.menuActive = false;
    const menus = await this.menuCtrl.getMenus();
    menus.forEach(menu => {
      menu.close();
    });
  }

  setSwipeEnabled(enabled: boolean) {
    this.swipeEnabledSubject.next(enabled);
  }
}
