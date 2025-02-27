import { Component, inject, Input } from '@angular/core';
import { BaseElement } from '../base.component';
import { FrameStep } from '../../shared/types';
import { MenuService } from '../../services/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent extends BaseElement {
  public menuService = inject(MenuService);

  @Input() title = '';
  @Input() back: string = '';

  menuVisible = false;

  async showHideMenu() {
    await this.menuService.toggleMenu();
  }

  public backClick(): void {
    this.navCtrl.navigateForward([this.back]);
  }
}
