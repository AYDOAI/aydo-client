import { Component, inject } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { UserService } from '../../services/user.service';
import { UIService } from '../../services/ui.service';
import { map } from 'rxjs';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

type MenuItem = {
  link: string;
  icon: string;
  title: string;
  step?: string;
};

type MenuSection = {
  type: 'General' | 'Other';
  items: MenuItem[];
};

@Component({
  selector: 'app-desktop-sidebar',
  templateUrl: './desktop-sidebar.component.html',
  styleUrl: './desktop-sidebar.component.scss',
})
export class DesktopSidebarComponent {
  public ui = inject(UIService);
  public menuService = inject(MenuService);
  public userService = inject(UserService);
  private navCtrl = inject(NavController);
  private router = inject(Router);

  fullName$ = this.userService.user$.pipe(
    map(user =>
      user ? `${user.firstname || ''} ${user.lastname || ''}`.trim() : ''
    )
  );

  avatar$ = this.userService.user$.pipe(map(user => user?.avatar?.url || null));

  balance$ = this.userService.user$.pipe(map(user => user?.balance || 0));

  public get currentUrl(): string {
    return this.router.url;
  }

  menu: MenuSection[] = [
    {
      type: 'General',
      items: [
        {
          link: '/dashboard',
          icon: 'menu-unknown',
          title: 'Dashboard',
          step: 'dashboard',
        },
        { link: '/streams', icon: 'menu-unknown', title: 'Projects' },
        { link: '/quests', icon: 'menu-service-status', title: 'Quests' },
        {
          link: '/devices',
          icon: 'menu-devices',
          title: 'Devices',
          step: 'devices',
        },
      ],
    },
    {
      type: 'Other',
      items: [
        { link: '/about', icon: 'menu-about', title: 'About' },
        { link: '/feedback', icon: 'menu-unknown', title: 'Feedback' },
      ],
    },
  ];

  async clickMenu(item: any) {
    if (item.link) {
      this.navCtrl.navigateForward([item.link]);
    }
  }
}
