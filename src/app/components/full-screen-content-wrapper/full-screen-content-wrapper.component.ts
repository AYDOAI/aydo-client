import { CommonModule } from '@angular/common';
import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  OnDestroy, Output, EventEmitter
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContentModule } from "../content/content.module";

@Component({
    selector: 'app-full-screen-content-wrapper',
    templateUrl: './full-screen-content-wrapper.component.html',
    styleUrls: ['./full-screen-content-wrapper.component.scss'],
    standalone: true,
    imports: [CommonModule, IonicModule, ContentModule],
})
export class FullScreenContentWrapperComponent implements OnInit, OnDestroy {

    @Input() contentClass!: string;
    @Input() isRefreshable = false;

    @ContentChild('header') headerTemplateRef!: TemplateRef<HTMLElement>;
    @ContentChild('headerAdditionalContent') headerAdditionalContentTemplateRef!: TemplateRef<HTMLElement>;
    @ContentChild('content') contentTemplateRef!: TemplateRef<HTMLElement>;
    @ContentChild('footer') footerTemplateRef!: TemplateRef<HTMLElement>;

    @ViewChild('footerWrapperDiv') private _footerWrapperDivElementRef!: ElementRef<HTMLDivElement>;

    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }
}
