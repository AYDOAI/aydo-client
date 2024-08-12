import { Injectable } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Injectable({
  providedIn: 'root'
})
export class BarcodeScannerService {
  public async scan(): Promise<Barcode> {
    const granted = await this.requestPermissions();
    if (!granted) {
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    return barcodes[0];
  }

  public async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === "granted" || camera === "limited";
  }
}
