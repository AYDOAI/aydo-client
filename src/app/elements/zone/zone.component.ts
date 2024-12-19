import {Component, ElementRef, forwardRef} from '@angular/core';
import {NG_VALUE_ACCESSOR} from '@angular/forms';
import {UIService} from '../../services/ui.service';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';
import {SelectComponent} from '../select/select.component';


@Component({
    selector: 'app-zone',
    templateUrl: '../select/select.component.html',
    styleUrls: ['../select/select.component.scss']
})
export class ZoneComponent extends SelectComponent {
    constructor(
        protected override readonly element: ElementRef<HTMLElement>,
        override readonly ui: UIService,
        override readonly router: Router,
        public backend: BackendService
    ) {
        super(element, ui, router);
    }

    ngOnInit() {
        if (this.form) {
            this.backend.getZones().then((zones) => {
                this.items = [];
                zones.forEach((zone: any) => {
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
}
