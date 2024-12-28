import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRipple]'
})
export class RippleDirective {
  @Input() appRipple: boolean = false;

  constructor(private el: ElementRef) { }

  @HostListener('click', ['$event']) onClick(event: MouseEvent) {
    if (!this.appRipple) {
      return;
    }
    const button = this.el.nativeElement;

    button.style.overflow = 'hidden';
    button.style.position = 'relative';

    const buttonWidth = button.offsetWidth;
    const buttonHeight = button.offsetHeight;
    let maxDimension = Math.max(buttonWidth, buttonHeight);

    const ripple = document.createElement('span');
    button.appendChild(ripple);

    const x = event.offsetX - maxDimension / 2;
    const y = event.offsetY - maxDimension / 2;

    ripple.style.width = `${maxDimension}px`;
    ripple.style.height = `${maxDimension}px`;
    ripple.style.top = `${y}px`;
    ripple.style.left = `${x}px`;
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.position = 'absolute';


    ripple.classList.add('ripple-animation');

    setTimeout(() => {
      button.removeChild(ripple);
    }, 600);
  }
}


