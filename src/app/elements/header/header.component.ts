import {Component, inject, Input} from '@angular/core';
import {BaseElement} from '../base.component';
import {FrameStep} from '../../shared/types';
import { MenuController } from "@ionic/angular";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent extends BaseElement {

  private menuController = inject(MenuController);

  @Input() title = '';
  @Input() add: FrameStep = '';
  @Input() back: string = '';


  menuVisible = false;

  showHideMenu() {
    this.menuVisible = !this.menuVisible;
    this.menuController.getMenus().then(data => console.log(data)).catch(err => console.log(err));
    if (!this.menuVisible) {
      this.menuController.close('mainMenu');
    } else {
      this.menuController.open('mainMenu').then(() => console.log('open'));
    }
  }

  addClick() {
    this.ui.goStep(this.add);
  }

  public backClick(): void {
    this.navCtrl.navigateForward([this.back]);
  }

}
