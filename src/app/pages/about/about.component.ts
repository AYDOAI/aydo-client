import { Component, OnInit, inject } from '@angular/core';
import { App } from '@capacitor/app';
import { DialogService } from '../../services/dialog.service';
import { LicenseDialogComponent } from '../../elements/dialog/license-dialog/license-dialog.component';
import { environment } from '../../../environments/environment';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
})
export class AboutComponent implements OnInit {
  public isModal: boolean = false;
  private dialog = inject(DialogService);
  protected readonly environment = environment;
  protected version!: string;

  ngOnInit(): void {
    const platform = Capacitor.getPlatform();
    if (platform === 'web') {
      this.version = 'web';
    }
    if (platform !== 'web') {
      App.getInfo().then(appInfo => {
        this.version = appInfo.version;
      });
    }
  }

  goToLink(url: string) {
    window.open(url, '_blank');
  }

  public openLicense(e: MouseEvent): void {
    e.preventDefault();
    this.dialog.show(LicenseDialogComponent, {
      headerTitle: 'License',
    });
  }
}
