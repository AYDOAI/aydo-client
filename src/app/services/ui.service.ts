import {Injectable, OnDestroy} from '@angular/core';
import {HubType, FrameStep} from '../shared/types';
import {StorageService} from './storage.service';
import {Subscription} from 'rxjs';
import {BackendService} from './backend.service';
import {DevicesModel, DriverItem, DriversModel} from '../models/gateway.model';

@Injectable({
  providedIn: 'root'
})
export class UIService implements OnDestroy {

  step!: FrameStep;
  selectedHubType: HubType = 'hub_aydo';
  initSub: Subscription | undefined;
  drivers!: DriversModel;
  selectedDriver!: DriverItem | undefined;
  devices!: DevicesModel;

  constructor(public storage: StorageService,
              public backend: BackendService) {
    this.initSub = this.storage.initSub().subscribe(data => {
      if (this.storage.token) {
        this.backend.userInfo().then(() => {
          if (this.storage.serverId) {
            this.backend.getDevices().then((devices: any) => {
              this.devices = new DevicesModel(devices);
              console.log(this.devices);
              const getDeviceValues = () => {
                this.backend.getDeviceValues().then((data: any) => {
                  data.forEach((item: any) => {
                    const device = this.devices.items.find(item1 => item1.ident === item.ident);
                    if (device) {
                      device.capabilities.forEach(cap => {
                        cap.value = item.values[`${cap.ident}_${cap.index}`]
                      })
                    }
                  })
                }).catch(() => {
                })
              }
              setInterval(() => {
                getDeviceValues()
              }, 5000);
              getDeviceValues();
            }).catch(() => {
            })
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
      } else {
        this.step = 'main';
      }
    })
  }

  ngOnDestroy() {
    this.initSub?.unsubscribe();
  }

}
