import { Component, inject, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-link',
  template:
    '<div class="link-container">' +
    '<a [attr.href]="link ? link : null" (click)="navigate($event)" target="_blank">{{ label }}</a>' +
    '<svg (click)="copy()" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M4 4.5V3C4 1.89543 4.89543 1 6 1H15C16.1046 1 17 1.89543 17 3V12C17 13.1046 16.1046 14 15 14H13.6667M3 17H12C13.1046 17 14 16.1046 14 15V6C14 4.89543 13.1046 4 12 4H3C1.89543 4 1 4.89543 1 6V15C1 16.1046 1.89543 17 3 17Z" stroke="#A1AE84" stroke-width="2"/>' +
    '</svg>' +
    '<div *ngIf="copied" class="tooltip fade-in">Copied!</div>' +
    '</div>',
  styles: [
    `
      .link-container {
        position: relative;
        padding: 12px 12px 12px 18px;

        display: flex;
        align-items: center;

        border: 1px solid var(--very-dark-blue);
        border-radius: 12px;

        svg {
          margin-left: auto;

          &:hover {
            opacity: 0.5;
          }
        }

        .tooltip {
          position: absolute;
          right: -10px;
          top: 35px;
          font-size: 14px;
          color: #fff;
          padding: 8px;
          background: rgba(#000, 0.7);
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.5s ease;
        }

        .fade-in {
          opacity: 1;
        }
      }
    `,
  ],
})
export class LinkContainerComponent {
  @Input() link: string = '';
  @Input() label: string = '';

  public copied: boolean = false;

  private router = inject(Router);

  public copy(): void {
    navigator.clipboard
      .writeText(this.link && this.link !== '#' ? this.link : this.label)
      .then(() => {
        this.copied = true;
        setTimeout(() => (this.copied = false), 1000);
      })
      .catch(err => {
        console.error(err);
      });
  }

  public navigate(e: Event): void {
    e.preventDefault();
    if (this.link && this.link !== '#') {
      this.router.navigateByUrl(this.link);
    }
  }
}
