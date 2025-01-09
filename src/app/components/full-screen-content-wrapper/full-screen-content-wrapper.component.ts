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
import { ActivatedRoute } from "@angular/router";

@Component({
    selector: 'app-full-screen-content-wrapper',
    templateUrl: './full-screen-content-wrapper.component.html',
    styleUrls: ['./full-screen-content-wrapper.component.scss'],
})
export class FullScreenContentWrapperComponent implements OnInit, OnDestroy {
    public currentPage = '';

    @Input() contentClass!: string;
    @Input() isRefreshable = false;

    @ContentChild('header') headerTemplateRef!: TemplateRef<HTMLElement>;
    @ContentChild('headerAdditionalContent') headerAdditionalContentTemplateRef!: TemplateRef<HTMLElement>;
    @ContentChild('content') contentTemplateRef!: TemplateRef<HTMLElement>;
    @ContentChild('footer') footerTemplateRef!: TemplateRef<HTMLElement>;

    @ViewChild('footerWrapperDiv') private _footerWrapperDivElementRef!: ElementRef<HTMLDivElement>;
    @ViewChild('headerContainer') private headerEl!: ElementRef;

    @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

    constructor(private route: ActivatedRoute) {
      this.currentPage = this.route.snapshot.url.join('');
    }

    public get getHeaderHeight(): number {
      return this.headerEl?.nativeElement.offsetHeight || 0;
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }
}
