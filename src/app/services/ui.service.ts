import {Injectable, OnDestroy} from '@angular/core';
import {HubType, FrameStep} from '../shared/types';
import {StorageService} from "./storage.service";
import {Subscription} from "rxjs";
import {BackendService} from "./backend.service";
import {DriverItem, DriversModel} from '../models/gateway.model';

@Injectable({
  providedIn: 'root'
})
export class UIService implements OnDestroy {

  step!: FrameStep;
  selectedHubType: HubType = 'hub_aydo';
  initSub: Subscription | undefined;
  drivers!: DriversModel;
  selectedDriver!: DriverItem | undefined;

  constructor(public storage: StorageService,
              public backend: BackendService) {
    this.initSub = this.storage.initSub().subscribe(data => {
      if (this.storage.token) {
        this.backend.userInfo().then(() => {
          if (this.storage.serverId) {
            this.step = 'dashboard';
          } else {
            this.step = 'add-hub';
          }
        }).catch(error => {
          if (error && error.name === 'JsonWebTokenError') {
            this.step = 'sign-in';
            //   this.backend.userRefresh().then(data => {
            //     console.log(data);
            //   }).catch((error) => {
            //     console.log(error);
            //   })
          }
        })
      }
    })
  }

  ngOnDestroy() {
    this.initSub?.unsubscribe();
  }

}
