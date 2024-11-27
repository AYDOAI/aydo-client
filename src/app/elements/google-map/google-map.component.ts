import {
  Component,
  forwardRef,
  Input
} from '@angular/core';
import {FormGroup, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BaseElement} from '../base.component';
import {environment} from '../../../environments/environment';

export const CUSTOM_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => GoogleMapComponent),
  multi: true
};

@Component({
  selector: 'app-google-map',
  templateUrl: './google-map.component.html',
  styleUrls: ['./google-map.component.scss'],
  providers: [CUSTOM_CONTROL_VALUE_ACCESSOR]
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
    navigator.geolocation.getCurrentPosition((position) => {
      this.currentLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
    });
  }

  addMarker(event: any) {
    this.markerPositions = [event.latLng.toJSON()];
    this.form.get(this.key)?.setValue(event.latLng.toString());
  }
}
