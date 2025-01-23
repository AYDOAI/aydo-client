import {
  Component,
  Input, signal
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {BaseElement} from '../base.component';

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  providers: []
})
export class GoogleMapComponent extends BaseElement {

  @Input() form!: FormGroup;
  @Input() key!: string;
  @Input() title!: string;

  currentLocation: any;

  mapOptions: google.maps.MapOptions = {
    zoom: 15,
    streetViewControl: false,
  }

  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
  };
  markerPositions: google.maps.LatLngLiteral[] = [];

  ngOnInit() {
    const defaultValue = this.form.get(this.key)?.value;
    if(defaultValue) {
      const [lat, lng] = defaultValue
        .replace(/[()]/g, '')
        .split(',')
        .map(Number);
      this.markerPositions = [{
        lat,
        lng
      }];
      this.currentLocation = {
        lat,
        lng
      };
    }
    if(!defaultValue) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      });
    }
  }


  updateMarkerPosition(point: google.maps.LatLng) {
    const newPos = point.toJSON();
    if (this.markerPositions.length > 0) {
      this.markerPositions[0] = newPos;
    } else {
      this.markerPositions = [newPos];
    }

    this.form.get(this.key)?.setValue(point.toString());
    this.form.get(this.key)?.markAsTouched();
  }

  onMarkerDragEnd(event: google.maps.MapMouseEvent) {
    if(event.latLng) {
      this.updateMarkerPosition(event.latLng);
    }
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if(event.latLng) {
      this.updateMarkerPosition(event.latLng);
    }
  }

  trackByFn(index: number) {
    return index;
  }
}
