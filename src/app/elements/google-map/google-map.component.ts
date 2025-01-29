import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
} from 'rxjs';
import { takeUntil, catchError, tap, map } from 'rxjs/operators';

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

  private destroy$ = new Subject<void>();

  mapOptions: google.maps.MapOptions = {
    zoom: 15,
    streetViewControl: false,
  };

  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };

  defaultCenter = {
    lat: 0,
    lng: 0,
  };

  markerPositions$ = new BehaviorSubject<google.maps.LatLngLiteral[]>([]);
  currentLocation$ = new BehaviorSubject<google.maps.LatLngLiteral>(
    this.defaultCenter
  );
  private positionUpdates$ = new Subject<google.maps.LatLngLiteral>();

  ngOnInit() {
    const initialPosition$ = this.getInitialPosition();

    merge(initialPosition$, this.positionUpdates$)
      .pipe(
        takeUntil(this.destroy$),
        tap(position => this.updateForm(new google.maps.LatLng(position)))
      )
      .subscribe(position => {
        this.markerPositions$.next([position]);
      });

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
        this.currentLocation$.next(position);
        return of(position);
      } catch (error) {
        console.error('Error parsing default position:', error);
        return this.getCurrentPosition();
      }
    }

    return this.getCurrentPosition().pipe(
      tap(position => this.currentLocation$.next(position))
    );
  }

  private getCurrentPosition() {
    return new Observable<google.maps.LatLngLiteral>(observer => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.currentLocation$.next(loc);
          observer.next(loc);
        },
        error => observer.error(error)
      );
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
