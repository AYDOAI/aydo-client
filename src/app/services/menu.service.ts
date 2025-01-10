import {Injectable} from '@angular/core';
import {MenuController} from '@ionic/angular';
import {NavigationStart, Router} from '@angular/router';
import {filter} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  public menuActive = false;

  constructor(private menuCtrl: MenuController,
              private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationStart)
    ).subscribe(() => {
      this.closeMenus();
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
      menu.close()
    });
  }
}
