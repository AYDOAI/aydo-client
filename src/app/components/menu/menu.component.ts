import { Component, inject, Input } from '@angular/core';
import { BaseElement } from '../../elements/base.component';
import { MenuService } from '../../services/menu.service';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent extends BaseElement {
  public menuService = inject(MenuService);
  public navigation = inject(NavigationService);
  swipeEnabled$ = this.menuService.swipeEnabled$;

  @Input() contentId: string = '';

  menu = [
    {
      link: '/dashboard',
      icon: 'menu-unknown',
      title: 'Dashboard',
      step: 'dashboard',
    },
    { link: '/streams', icon: 'menu-unknown', title: 'Data streams' },
    { link: '/quests', icon: 'menu-service-status', title: 'Quests' },
    {
      link: '/devices',
      icon: 'menu-devices',
      title: 'Devices',
      step: 'devices',
    },
    // {link: '/settings', icon: 'menu-hub-settings', title: 'Hub settings'},
    {
      link: '/profile',
      icon: 'menu-profile',
      title: 'Profile',
      step: 'profile',
    },
    // {link: '/status', icon: 'menu-service-status', title: 'Services status'},
    { link: '/feedback', icon: 'menu-unknown', title: 'Feedback' },
    { link: '/about', icon: 'menu-about', title: 'About' },
  ];

  async clickMenu(item: any) {
    if (item.link === this.router.url) {
      this.menuService.closeMenus();
      return;
    }
    if (item.link) {
      this.navCtrl.navigateForward([item.link]);
    }
  }
}
