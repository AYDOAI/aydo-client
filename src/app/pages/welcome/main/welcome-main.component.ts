import {Component} from '@angular/core';
import {FormBaseComponent} from '../../../components/form-base.component';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-welcome-main',
  templateUrl: './welcome-main.component.html',
  styleUrl: './welcome-main.component.scss'
})
export class WelcomeMainComponent extends FormBaseComponent {

  override ngOnInit() {
    super.ngOnInit();
    StatusBar.setBackgroundColor({ color: '#947FFF' });
  }
}
