import {Injectable, OnDestroy} from '@angular/core';
import {WelcomeStep} from '../shared/types';
import {StorageService} from "./storage.service";
import {Subscription} from "rxjs";
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class WelcomeService implements OnDestroy {

  step: WelcomeStep = 'main';
  initSub: Subscription | undefined;

  constructor(public storage: StorageService,
              public backend: BackendService) {
    this.initSub = this.storage.initSub().subscribe(data => {
      if (this.storage.token) {
        this.backend.userInfo().then(() => {
          this.step = 'add-hub';
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
