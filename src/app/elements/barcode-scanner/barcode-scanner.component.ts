import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  Barcode,
  BarcodeFormat,
  BarcodeScanner,
  LensFacing,
  StartScanOptions,
} from '@capacitor-mlkit/barcode-scanning';
import { InputCustomEvent } from '@ionic/angular';
import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.scss',
})
export class BarcodeScannerComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input()
  public formats: BarcodeFormat[] = [];
  @Input()
  public lensFacing: LensFacing = LensFacing.Back;

  @ViewChild('square')
  public squareElement: ElementRef<HTMLDivElement> | undefined;
  public minZoomRatio: number | undefined;
  public maxZoomRatio: number | undefined;

  constructor(
    private readonly dialogService: ModalService,
    private readonly ngZone: NgZone
  ) {}

  public ngOnInit(): void {}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.startScan();
    }, 500);
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  public setZoomRatio(event: InputCustomEvent): void {
    if (!event.detail.value) {
      return;
    }
    BarcodeScanner.setZoomRatio({
      zoomRatio: parseInt(event.detail.value as any, 10),
    });
  }

  public async closeModal(barcode?: Barcode): Promise<void> {
    this.dialogService.dismissModal({
      barcode: barcode,
    });
  }

  private async startScan(): Promise<void> {
    document.querySelector('body')?.classList.add('barcode-scanning-active');

    const options: StartScanOptions = {
      formats: this.formats,
      lensFacing: this.lensFacing,
    };

    const squareElementBoundingClientRect =
      this.squareElement?.nativeElement.getBoundingClientRect();

    const scaledRect = squareElementBoundingClientRect
      ? {
          left: squareElementBoundingClientRect.left * window.devicePixelRatio,
          right:
            squareElementBoundingClientRect.right * window.devicePixelRatio,
          top: squareElementBoundingClientRect.top * window.devicePixelRatio,
          bottom:
            squareElementBoundingClientRect.bottom * window.devicePixelRatio,
          width:
            squareElementBoundingClientRect.width * window.devicePixelRatio,
          height:
            squareElementBoundingClientRect.height * window.devicePixelRatio,
        }
      : undefined;

    const detectionCornerPoints = scaledRect
      ? [
          [scaledRect.left, scaledRect.top],
          [scaledRect.left + scaledRect.width, scaledRect.top],
          [
            scaledRect.left + scaledRect.width,
            scaledRect.top + scaledRect.height,
          ],
          [scaledRect.left, scaledRect.top + scaledRect.height],
        ]
      : undefined;

    const listener = await BarcodeScanner.addListener(
      'barcodesScanned',
      async event => {
        this.ngZone.run(() => {
          const cornerPoints = event.barcodes[0].cornerPoints;
          if (detectionCornerPoints && cornerPoints) {
            if (
              detectionCornerPoints[0][0] > cornerPoints[0][0] ||
              detectionCornerPoints[0][1] > cornerPoints[0][1] ||
              detectionCornerPoints[1][0] < cornerPoints[1][0] ||
              detectionCornerPoints[1][1] > cornerPoints[1][1] ||
              detectionCornerPoints[2][0] < cornerPoints[2][0] ||
              detectionCornerPoints[2][1] < cornerPoints[2][1] ||
              detectionCornerPoints[3][0] > cornerPoints[3][0] ||
              detectionCornerPoints[3][1] < cornerPoints[3][1]
            ) {
              return;
            }
          }
          listener.remove();
          this.closeModal(event.barcodes[0]);
        });
      }
    );
    try {
      await BarcodeScanner.startScan(options);
    } catch (e) {
      console.log(e);
    }

    void BarcodeScanner.getMinZoomRatio().then(result => {
      this.minZoomRatio = result.zoomRatio;
    });
    void BarcodeScanner.getMaxZoomRatio().then(result => {
      this.maxZoomRatio = result.zoomRatio;
    });
  }

  private async stopScan(): Promise<void> {
    document.querySelector('body')?.classList.remove('barcode-scanning-active');

    await BarcodeScanner.stopScan();
  }
}
