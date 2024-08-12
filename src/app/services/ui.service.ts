import {Injectable, OnDestroy} from '@angular/core';
import {HubType, FrameStep} from '../shared/types';
import {StorageService} from './storage.service';
import {Subscription} from 'rxjs';
import {BackendService} from './backend.service';
import {DevicesModel, DriverItem, DriversModel} from '../models/gateway.model';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UIService implements OnDestroy {

  private _step!: FrameStep;
  selectedHubType: HubType = 'hub_aydo';
  initSub: Subscription | undefined;
  drivers!: DriversModel;
  selectedDriver!: DriverItem | undefined;
  devices!: DevicesModel;
  valuesInterval!: any;
  user!: any;

  constructor(public storage: StorageService,
              public backend: BackendService,
              public router: Router) {
    this.initSub = this.storage.initSub().subscribe(data => {
      this.afterLogin();
    })
  }

  ngOnDestroy() {
    this.initSub?.unsubscribe();
  }

  afterLogin() {
    if (this.storage.token) {
      this.backend.userInfo().then((data) => {
        this.user = data.user;
        const next = () => {
          this.backend.getDevices().then((devices: any) => {
            this.devices = new DevicesModel(devices);
            // console.log(devices);
            const getDeviceValues = () => {
              this.backend.getDeviceValues().then((data: any) => {
                // console.log(data);
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
            clearInterval(this.valuesInterval);
            this.valuesInterval = setInterval(() => {
              if (this.storage.token) {
                getDeviceValues()
              }
            }, 5000);
            getDeviceValues();
          }).catch(() => {
          });
          this.defaultStep();
        }
        if (this.storage.serverId) {
          next();
        } else {
          this.backend.getGateway().then((data) => {
            if (data && data.gateway && data.gateway.identifier) {
              this.storage.serverId = data.gateway.identifier;
              next();
            } else {
              this.goStep('add-hub');
            }
          })
        }
      }).catch(error => {
        this.goStep('sign-in');
        if (error && error.name === 'JsonWebTokenError') {
          //   this.backend.userRefresh().then(data => {
          //     console.log(data);
          //   }).catch((error) => {
          //     console.log(error);
          //   })
        }
      })
    } else {
      this.goStep('main');
    }
  }

  // get step(): FrameStep {
  //   return this._step;
  // }

  goStep(step: FrameStep) {
    this._step = step;
    this.router.navigate([`/${step}`])
  }

  defaultStep() {
    this.goStep('dashboard');
  }

}
