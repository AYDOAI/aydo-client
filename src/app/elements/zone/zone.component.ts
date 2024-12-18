import {Component, ElementRef, EventEmitter, forwardRef, Input, Output, ViewChild} from '@angular/core';
import {FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseElement} from '../base.component';
import {UIService} from '../../services/ui.service';
import {Router} from '@angular/router';
import {BackendService} from '../../services/backend.service';
import {ZoneModel} from '../../models/gateway.model';

export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ZoneComponent),
    multi: true
};

@Component({
    selector: 'app-zone',
    templateUrl: './zone.component.html',
    styleUrls: ['./zone.component.scss'],
    providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class ZoneComponent extends BaseElement {

    @Input() title!: string;
    @Input() type!: string | undefined;
    @Input() form!: FormGroup;
    @Input() key!: string;
    @Input() placeholder!: string;
    @Input() error: any;

    public zones: ZoneModel | undefined;

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
            this.backend.getZones().then((data) => {
                this.zones = new ZoneModel(data);
                console.log(this.zones);
            });
        }
    }
}
