import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router, NavigationStart } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { FeedbackComponent } from '../pages/feedback/feedback.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { DashboardRewardsComponent } from '../pages/dashboard/rewards/dashboard-rewards.component';
import { HubComponent } from '../pages/hub/hub.component';
import { AboutComponent } from '../pages/about/about.component';
import { AddDeviceComponent } from '../pages/devices/add/add-device.component';
import { NewDeviceComponent } from '../pages/devices/new/new-device.component';
import { EditProfileComponent } from '../pages/profile/edit/edit-profile.component';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.isMobileSubject.asObservable();

  private readonly modalRouteComponentMap = new Map<string, any>([
    ['feedback', FeedbackComponent],
    ['profile/edit', EditProfileComponent],
    ['profile', ProfileComponent],
    ['dashboard/rewards', DashboardRewardsComponent],
    ['about', AboutComponent],
    ['add-hub', HubComponent],
    ['devices/add', AddDeviceComponent],
    ['devices/new', NewDeviceComponent],
  ]);

  private currentModal: HTMLIonModalElement | null = null;
  private previousUrl: string = '';

  constructor(
    private router: Router,
    private modalCtrl: ModalController
  ) {
    this.checkScreenSize();
    window.addEventListener('resize', () => this.checkScreenSize());

    this.router.events
      .pipe(
        filter(
          (event): event is NavigationStart => event instanceof NavigationStart
        )
      )
      .subscribe(event => this.handleNavigation(event));
  }

  private checkScreenSize(): void {
    const isMobile = window.innerWidth <= 768;
    this.isMobileSubject.next(isMobile);
  }

  private async handleNavigation(event: NavigationStart): Promise<void> {
    const url = event.url;
    const isMobile = await this.isMobile$.pipe(take(1)).toPromise();

    const matchingRoute = [...this.modalRouteComponentMap.keys()].find(route =>
      url.includes(route)
    );

    if (matchingRoute && !isMobile) {
      if (!this.currentModal) {
        this.previousUrl = this.router.url;
      }
      this.router.navigateByUrl(this.previousUrl, {
        skipLocationChange: true,
        replaceUrl: true,
      });
      await this.openModal(matchingRoute);
      window.history.pushState({}, '', url);
    }
  }

  private async openModal(route: string): Promise<void> {
    const component = this.modalRouteComponentMap.get(route);
    if (!component) return;

    if (this.currentModal) {
      await this.currentModal.dismiss();
      this.currentModal = null;
    }

    const modal = await this.modalCtrl.create({
      component,
      cssClass: 'modal-wrapper',
      componentProps: { isModal: true },
    });

    this.currentModal = modal;
    await modal.present();

    modal.onDidDismiss().then(() => {
      if (this.currentModal === modal) {
        this.currentModal = null;
        if (this.previousUrl.length > 2) {
          this.router.navigateByUrl(this.previousUrl, {
            skipLocationChange: true,
          });
          window.history.pushState({}, '', this.previousUrl);
        }
      }
    });
  }
}
