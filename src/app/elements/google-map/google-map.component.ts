import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BaseElement } from '../base.component';
import {
  BehaviorSubject,
  Observable,
  Subject,
  EMPTY,
  of,
  merge,
  filter,
  switchMap,
  first,
  concat,
} from 'rxjs';
import { takeUntil, catchError, tap, map, last } from 'rxjs/operators';
import { Geolocation } from '@capacitor/geolocation';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
})
export class GoogleMapComponent
  extends BaseElement
  implements OnInit, OnDestroy
{
  @Input() form!: FormGroup;
  @Input() key!: string;
  @Input() title!: string;

  private platform = inject(Platform);

  private destroy$ = new Subject<void>();

  mapOptions: google.maps.MapOptions = {
    zoom: 15,
    streetViewControl: false,
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };

  defaultCenter = {
    lat: 44.14625905641436,
    lng: -105.5449705613737,
  };

  markerPositions$ = new BehaviorSubject<google.maps.LatLngLiteral[]>([]);
  currentLocation$ = new BehaviorSubject<google.maps.LatLngLiteral>(
    this.defaultCenter
  );
  private positionUpdates$ = new Subject<google.maps.LatLngLiteral>();

  ngOnInit() {
    const currentPosition$ = this.getCurrentPosition();
    const initialPosition$ = this.getInitialPosition();

    concat(initialPosition$, currentPosition$)
      .pipe(first())
      .subscribe({
        next: position => {
          this.currentLocation$.next(position);
        },
        error: error => {
          console.error('Error:', error);
        },
      });

    merge(initialPosition$, this.positionUpdates$)
      .pipe(
        takeUntil(this.destroy$),
        tap(position => this.updateForm(new google.maps.LatLng(position)))
      )
      .subscribe();

    this.markerPositions$.next([
      this.parsePosition(this.form.get(this.key)?.value),
    ]);

    this.form
      .get(this.key)
      ?.valueChanges.pipe(
        takeUntil(this.destroy$),
        filter(value => !!value),
        map(value => this.parsePosition(value))
      )
      .subscribe(position => {
        this.markerPositions$.next([position]);
      });
  }

  private updateForm(position: google.maps.LatLng) {
    this.form.get(this.key)?.setValue(position.toString());
    this.form.get(this.key)?.markAsTouched();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.markerPositions$.complete();
    this.positionUpdates$.complete();
  }

  private parsePosition(value: string): google.maps.LatLngLiteral {
    const [lat, lng] = value.replace(/[()]/g, '').split(',').map(Number);

    return { lat, lng };
  }

  private getInitialPosition() {
    const defaultValue = this.form.get(this.key)?.value;
    if (defaultValue) {
      try {
        const position = this.parsePosition(defaultValue);
        return of(position);
      } catch (error) {
        console.error('Error parsing default position:', error);
        return EMPTY;
      }
    }

    return EMPTY;
  }

  private getCurrentPosition() {
    return new Observable<google.maps.LatLngLiteral>(observer => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        Geolocation.getCurrentPosition().then(
          position => {
            observer.next({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          error => {
            observer.error(error);
          }
        );
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            observer.next({
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            });
          },
          positionError => {
            observer.error(positionError.message);
          }
        );
      }
    }).pipe(
      catchError(error => {
        console.error('Geolocation error:', error);
        return EMPTY;
      })
    );
  }

  updateMarkerPosition(point: google.maps.LatLng) {
    this.positionUpdates$.next(point.toJSON());
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    event.latLng && this.updateMarkerPosition(event.latLng);
  }

  addMarker(event: google.maps.MapMouseEvent) {
    event.latLng && this.updateMarkerPosition(event.latLng);
  }

  trackByFn(index: number) {
    return index;
  }
}
