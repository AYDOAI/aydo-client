import {Component, ElementRef, forwardRef, inject} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {UIService} from '../../services/ui.service';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';
import {SelectComponent} from '../select/select.component';
import { NavController } from "@ionic/angular";
import {ZoneService} from "../../services/zone.service";


@Component({
    selector: 'app-zone',
    templateUrl: '../select/select.component.html',
    styleUrls: ['../select/select.component.scss']
})
export class ZoneComponent extends SelectComponent {
    private zoneService = inject(ZoneService);

    constructor(
        protected override readonly element: ElementRef<HTMLElement>,
        override readonly ui: UIService,
        override readonly router: Router,
        override readonly navCtrl: NavController,
    ) {
        super(element, ui, router, navCtrl);
    }

    ngOnInit() {
      this.zoneService.load().then(() => {
        this.items = [];
        this.zoneService.zones?.items?.forEach((zone: any) => {
          this.items.push({
            id: zone.id,
            title: zone.name,
          })
        });

        this.items.push({
          title: 'Add zone',
          selectCallback: () => {
            this.router.navigate(['/zone/add']);
          },
        })
      });
    }
}
