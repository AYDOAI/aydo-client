import {Injectable, OnInit} from "@angular/core";
import {BackendService} from "./backend.service";
import {LoadingService} from "./loading.service";
import {ErrorsService} from "./errors.service";
import { ZoneModel} from "../models/gateway.model";

@Injectable()
export class ZoneService {
  zones!: ZoneModel;

  constructor(
    public backend: BackendService,
    private loading: LoadingService,
  ) {
  }

  load() {
    this.loading.showLoading();
    return this.backend.getZones().then((zones) => {
      this.zones = new ZoneModel(zones);
      this.loading.dismissLoading();
    });
  }
}
