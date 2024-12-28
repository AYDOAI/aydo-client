import {Component, OnInit, inject} from '@angular/core';
import {DialogService} from "../../services/dialog.service";
import {LicenseDialogComponent} from '../../elements/dialog/license-dialog/license-dialog.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements OnInit {
  private dialog = inject(DialogService);

  ngOnInit(): void {

  }
  
  goToLink(url: string) {
    window.open(url, "_blank");
  }

  public openLicense(e: MouseEvent): void {
    e.preventDefault()
    this.dialog.show(LicenseDialogComponent, {
      headerTitle: 'License'
    })
  }

}
