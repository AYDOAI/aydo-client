import {
  Component,
  ContentChild,
  ElementRef,
  Input,
  TemplateRef,
  ViewChild,
  Output,
  EventEmitter,
  inject,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from '../../services/menu.service';
import { UIService } from '../../services/ui.service';

@Component({
  selector: 'app-full-screen-content-wrapper',
  templateUrl: './full-screen-content-wrapper.component.html',
  styleUrls: ['./full-screen-content-wrapper.component.scss'],
})
export class FullScreenContentWrapperComponent {
  public currentPage = '';
  public menuService = inject(MenuService);

  @Input() contentClass!: string;
  @Input() isRefreshable = false;

  @ContentChild('header') headerTemplateRef!: TemplateRef<HTMLElement>;
  @ContentChild('headerAdditionalContent')
  headerAdditionalContentTemplateRef!: TemplateRef<HTMLElement>;
  @ContentChild('content') contentTemplateRef!: TemplateRef<HTMLElement>;
  @ContentChild('footer') footerTemplateRef!: TemplateRef<HTMLElement>;

  @ViewChild('footerWrapperDiv')
  private _footerWrapperDivElementRef!: ElementRef<HTMLDivElement>;
  @ViewChild('headerContainer') private headerEl!: ElementRef;

  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private router: Router,
    private ui: UIService
  ) {
    this.currentPage = this.router.url.replace(/\//g, '');
  }

  public get getHeaderHeight(): number {
    return this.headerEl?.nativeElement.offsetHeight || 0;
  }

  public get isMobile(): boolean {
    return this.ui.isMobile;
  }
}
