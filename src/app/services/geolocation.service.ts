import { Injectable, inject } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';
import { Observable, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  private platform = inject(Platform);

  private async getPositionNative() {
    const permissionStatus = await Geolocation.checkPermissions();
    if (permissionStatus?.location !== 'granted') {
      const requestStatus = await Geolocation.requestPermissions();
      if (requestStatus.location !== 'granted') {
        throw new Error('Location permission not granted');
      }
    }
    return await Geolocation.getCurrentPosition({
      maximumAge: 3000,
      timeout: 10000,
      enableHighAccuracy: true,
    });
  }

  getCurrentPosition(): Observable<google.maps.LatLngLiteral> {
    return new Observable<google.maps.LatLngLiteral>(observer => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.getPositionNative().then(
          position => {
            observer.next({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            observer.complete();
          },
          error => {
            console.error('Native Geolocation error:', error);
            observer.error(error);
          }
        );
      } else if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            observer.next({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
            observer.complete();
          },
          positionError => {
            console.error('Browser Geolocation error:', positionError.message);
            observer.error(positionError.message);
          }
        );
      } else {
        observer.error(
          'Geolocation is not supported by this browser or platform.'
        );
      }
    }).pipe(
      catchError(error => {
        console.error('Geolocation Observable error:', error);
        return EMPTY;
      })
    );
  }
}
