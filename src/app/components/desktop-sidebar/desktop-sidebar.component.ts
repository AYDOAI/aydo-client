import { Component, inject, OnInit } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { FormBaseComponent } from '../form-base.component';

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
export class DesktopSidebarComponent extends FormBaseComponent implements OnInit {
  public menuService = inject(MenuService);

  public get currentUrl(): string {
    return this.router.url;
  }

  override ngOnInit() {
    this.form.inputs = [
      {
        key: 'avatar',
        type: 'avatar',
        title: 'Avatar',
        readonly: true,
      },
    ];
    this.formGroup = this.createForm(this.form.inputs);
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
        { link: '/streams', icon: 'menu-unknown', title: 'Data streams' },
        { link: '/quests', icon: 'menu-service-status', title: 'Quests' },
        {
          link: '/devices',
          icon: 'menu-devices',
          title: 'Devices',
          step: 'devices',
        },
        {
          link: '/profile',
          icon: 'menu-profile',
          title: 'Profile',
          step: 'profile',
        },
        { link: '/feedback', icon: 'menu-unknown', title: 'Feedback' },
      ],
    },
    {
      type: 'Other',
      items: [{ link: '/about', icon: 'menu-about', title: 'About' }],
    },
  ];

  async clickMenu(item: any) {
    if (item.link) {
      this.navCtrl.navigateForward([item.link]);
    }
  }
}
