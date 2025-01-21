import {Injectable} from "@angular/core";
import {BackendService} from "./backend.service";
import {LoadingService} from "./loading.service";
import {ZoneModel} from "../models/gateway.model";
import {Subject} from 'rxjs';

@Injectable()
export class ZoneService {
  zones!: ZoneModel;
  public forceUpdate$ = new Subject<boolean>();

  constructor(
    public backend: BackendService,
    private loading: LoadingService,
  ) {
    this.forceUpdate$.subscribe(() => this.handleForceUpdate());
  }

  load() {
    this.loading.showLoading();
    return this.backend.getZones().then((zones) => {
      this.zones = new ZoneModel(zones);
      this.loading.dismissLoading();
    });
  }

  private handleForceUpdate() {
    setTimeout(() => {
      this.backend.getZones().then((zones) => {
        this.zones = new ZoneModel(zones);
      })
    }, 5000);
  }
}
