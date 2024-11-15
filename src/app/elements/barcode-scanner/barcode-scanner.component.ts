import {
  AfterViewInit,
  Component,
  ElementRef,
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
import { BaseDialogComponent } from '../dialog/base-dialog';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-barcode-scanner',
  templateUrl: 'barcode-scanner.component.html',
  styleUrl: './barcode-scanner.component.scss'
})
export class BarcodeScannerComponent extends BaseDialogComponent
  implements OnInit, AfterViewInit, OnDestroy {
  private static formats: BarcodeFormat[] = [];
  private static lensFacing: LensFacing = LensFacing.Back;

  @ViewChild('square')
  public squareElement: ElementRef<HTMLDivElement> | undefined;

  public isTorchAvailable = false;

  constructor(
    private readonly ngZone: NgZone,
    private readonly platform: Platform
  ) {
    super();
  }

  public async ngOnInit(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.close();
    }
    this.checkTorchAvailable();
    this.checkGoogleScannerModule();
  }

  public ngAfterViewInit(): void {
    this.startScan();
  }

  public ngOnDestroy(): void {
    this.stopScan();
  }

  public async closeModal(barcode?: Barcode): Promise<void> {
    if (barcode) {
      // TODO: callback to parent component
      this.close();
    } else {
      this.close();
    }
  }

  public async toggleTorch(): Promise<void> {
    await BarcodeScanner.toggleTorch();
  }

  private async startScan(): Promise<void> {
    const options: StartScanOptions = {
      formats: BarcodeScannerComponent.formats,
      lensFacing: BarcodeScannerComponent.lensFacing,
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
      'barcodeScanned',
      async (event) => {
        this.ngZone.run(() => {
          const cornerPoints = event.barcode.cornerPoints;
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
          this.closeModal(event.barcode);
        });
      },
    );
    document.querySelector('body')?.classList.add('barcode-scanner-active');
    await BarcodeScanner.startScan(options);
  }

  private async stopScan(): Promise<void> {
    document.querySelector('body')?.classList.remove('barcode-scanner-active');
    await BarcodeScanner.stopScan();
  }

  private async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  private checkTorchAvailable(): void {
    BarcodeScanner.isTorchAvailable().then((result) => {
      this.isTorchAvailable = result.available;
    });
  }

  private checkGoogleScannerModule(): void {
    if (this.platform.is('android')) {
      BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then(async (result) => {
          if (!result.available) {
            await BarcodeScanner.installGoogleBarcodeScannerModule();
          }
        }
      );
    }
  }
}
