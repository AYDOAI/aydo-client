import { Injectable, OnDestroy } from '@angular/core';
import { HubType, FrameStep } from '../shared/types';
import { StorageService } from './storage.service';
import { finalize, Subscription } from 'rxjs';
import { BackendService } from './backend.service';
import { DeviceItem, DevicesModel, DriverItem, DriversModel } from '../models/gateway.model';
import { Router } from '@angular/router';
import { LoadingService } from './loading.service';
import { Network } from '@capacitor/network';
import { NavController } from "@ionic/angular";
import { ErrorsService } from "./errors.service";

@Injectable({
  providedIn: 'root'
})
export class UIService implements OnDestroy {
  private _step!: FrameStep;
  selectedHubType: HubType = 'hub_aydo';
  initSub: Subscription | undefined;
  drivers!: DriversModel;
  selectedDriver!: DriverItem | undefined;
  selectedDevice!: DeviceItem | undefined;
  devices!: DevicesModel;
  valuesInterval!: any;
  user: {
    balance: string;
    email: string;
    wallet: string;
    firstname: string;
    lastname: string;
    id: number;
    is_verified: boolean;
    login: string;
    params: any;
    token: string;
    refresh_token: string;
    avatar?: {
      fileId: string;
      url: string;
    };
  } | null | undefined = null;
  public appReady: boolean = false;
  public inviteId: string;
  public isOnline: boolean = true;
  public gateway: { identifier: string, userId: string, token: string, is_online: boolean } | null | undefined = null;
  private btnLoading: string[] = [];

  constructor(public storage: StorageService,
              public backend: BackendService,
              public router: Router,
              public navCtrl: NavController,
              private loading: LoadingService,
              private errors: ErrorsService) {
    const urlSearchParams = new URLSearchParams(window.location.search);
    this.inviteId = urlSearchParams.get('code') ?? '';
    this.initSub = this.loading.showLoading$(this.storage.initSub()).subscribe(data => {
      this.afterLogin();
    });
    this.subscribeToNetworkStatus();
  }

  ngOnDestroy() {
    this.initSub?.unsubscribe();
  }

  tryDemo(): void {
    this.lockBtn('try_demo');
    this.backend.demoLogin().pipe(finalize(() => {
      this.unlockBtn('try_demo');
    })).subscribe(() => {
      this.afterLogin();
    }, () => {
      this.errors.showError(`An error occurred, please try again later`)
    });
  }

  afterLogin() {
    if (this.storage.token) {
      this.loading.showLoading();
      this.backend.userInfo()
        .pipe(finalize(() => {
          this.appReady = true;
          this.loading.dismissLoading();
          if (this.isAuthPage()) {
            this.defaultStep();
          }
        })).subscribe((data: any) => {
          this.user = data.user;
          if (!this.user?.is_verified) {
            this.goStep('success');
            return
          }
          const next = () => {
            this.loading.showLoading();
            this.getDevices();
            if (this.isAuthPage()) {
              this.defaultStep();
            }
          }
          this.loading.showLoading();
          this.getGateway(next)
        }, (error) => {
          this.goStep('sign-in');
          if (error && error.name === 'JsonWebTokenError') {
            //   this.backend.userRefresh().then(data => {
            //     console.log(data);
            //   }).catch((error) => {
            //     console.log(error);
            //   })
          }
        }
      )
    } else {
      this.appReady = true;
      this.loading.dismissLoading();
      if (!this.isAuthPage()) {
        this.goStep('main');
      }
    }
  }

  // get step(): FrameStep {
  //   return this._step;
  // }

  goStep(step: FrameStep) {
    this._step = step;
    this.navCtrl.navigateForward([`/${step}`])
  }

  defaultStep() {
    this.goStep('streams');
  }

  public logout(): void {
    this.storage.token = '';
    this.storage.refreshToken = '';
    this.storage.serverId = '';
    this.user = null;
    clearInterval(this.valuesInterval);
    this.navCtrl.navigateForward(['/sign-in']);
  }

  public lockBtn(key: string): void {
    this.btnLoading.push(key);
  }

  public unlockBtn(key: string): void {
    setTimeout(() => {
      this.btnLoading = this.btnLoading.filter(el => el !== key)
    }, 200);
  }

  public isBtnLoading(key: string): boolean {
    return this.btnLoading.includes(key);
  }

  public getDevices(event: any = null): void {
    const complete = () => {
      if (event) {
        event.target.complete();
      }
    }
    if (this.storage.serverId) {
      this.backend.getDevices().pipe(finalize(() => {
        this.loading.dismissLoading();
        complete();
      })).subscribe((devices: any) => {
        this.devices = new DevicesModel(devices);
        // console.log(devices);
        const getDeviceValues = () => {
          if (this.storage.serverId && this.storage.token) {
            this.backend.getDeviceValues().pipe(finalize(() => {
              this.loading.dismissLoading();
              complete();
            })).subscribe((data: any) => {
                // console.log(data);
                const updateDeviceValues = (values: any) => {
                  values.forEach((item: any) => {
                    const device = this.devices.items.find(item1 => item1.ident === item.ident);
                    if (device) {
                      device.capabilities.forEach(cap => {
                        cap.value = item.values[`${cap.ident}_${cap.index}`]
                      })
                    }
                  })
                }
                if (data.length !== this.devices?.items?.length) {
                  this.backend.getDevices().pipe(finalize(() => {
                    updateDeviceValues(data);
                  })).subscribe((devices: any) => {
                    this.devices = new DevicesModel(devices);
                  })
                } else {
                  updateDeviceValues(data);
                }
              }
            )
          }
        }
        clearInterval(this.valuesInterval);
        this.valuesInterval = setInterval(() => {
          if (this.storage.token) {
            getDeviceValues()
          }
        }, 5000);
        getDeviceValues();
      })
    } else {
      complete();
    }
  }

  getGateway(next?: () => void): void {
    this.loading.showLoading$(this.backend.getGateway()).subscribe((data) => {
        if (data && data.gateway && data.gateway.identifier) {
          this.storage.serverId = data.gateway.identifier;
          this.gateway = data.gateway;
          if (next) {
            next();
          }
        } else {
          if (this.isAuthPage()) {
            this.goStep('add-hub');
          }
        }
      })
  }

  public getDrivers(): void {
    this.loading.showLoading$(this.backend.drivers()).subscribe((drivers: DriverItem[]) => {
      this.drivers = new DriversModel(drivers);
    })
  }

  private isAuthPage(): boolean {
    const currentUrl = this.router.url;
    return currentUrl.includes('sign-up') || currentUrl.includes('sign-in') || currentUrl.includes('main') || currentUrl.includes('auth-redirect')
  }

  private async subscribeToNetworkStatus(): Promise<void> {
    const status = await Network.getStatus();
    this.isOnline = status.connected;

    Network.addListener('networkStatusChange', status => {
      this.isOnline = status.connected;
    });
  }
}
