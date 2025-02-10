import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Clipboard } from '@capacitor/clipboard';

@Injectable({
  providedIn: 'root',
})
export class ClipboardService {
  private renderer: Renderer2;
  private isCopying = false;
  private isTooltipVisible = false;

  constructor(
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  async copy(text: string, event?: MouseEvent | TouchEvent): Promise<void> {
    if (!text || this.isCopying) return;
    this.isCopying = true;
    try {
      await Clipboard.write({ string: text });
      this.showTooltip(event);
    } catch (error: any) {
      console.error(error);
    } finally {
      this.isCopying = false;
    }
  }

  private showTooltip(event?: MouseEvent | TouchEvent): void {
    if (!event || this.isTooltipVisible) return;

    const tooltip = this.renderer.createElement('div');
    const textNode = this.renderer.createText('copied');

    this.renderer.appendChild(tooltip, textNode);
    this.renderer.setStyle(tooltip, 'position', 'fixed');
    this.renderer.setStyle(tooltip, 'backgroundColor', 'rgba(0, 0, 0, 0.7)');
    this.renderer.setStyle(tooltip, 'color', '#fff');
    this.renderer.setStyle(tooltip, 'padding', '6px 8px');
    this.renderer.setStyle(tooltip, 'borderRadius', '4px');
    this.renderer.setStyle(tooltip, 'fontSize', '14px');
    this.renderer.setStyle(tooltip, 'zIndex', '1000');
    this.renderer.setStyle(tooltip, 'pointerEvents', 'none');

    const clientX =
      'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY =
      'touches' in event ? event.touches[0].clientY : event.clientY;

    this.renderer.setStyle(tooltip, 'left', `${clientX - 10}px`);
    this.renderer.setStyle(tooltip, 'top', `${clientY}px`);

    this.renderer.appendChild(this.document.body, tooltip);
    this.isTooltipVisible = true;

    setTimeout(() => {
      this.renderer.removeChild(this.document.body, tooltip);
      this.isTooltipVisible = false;
    }, 1000);
  }
}
