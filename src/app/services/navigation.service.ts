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
import { ProjectComponent } from '../pages/streams/project/project.component';
import { ConnectDevicesComponent } from '../pages/connect-devices/connect-devices.component';
import { HubEditComponent } from '../pages/devices/hub/hub-edit.component';
import { DeviceEditComponent } from '../pages/devices/edit/device-edit.component';
import { FormAddHubAgreementComponent } from '../components/forms/add-hub-agreement/form-add-hub-agreement.component';
import { FormAddHubManuallyComponent } from '../components/forms/add-hub-manually/form-add-hub-manually.component';
import { FormAddHubConnectedComponent } from '../components/forms/add-hub-connected/form-add-hub-connected.component';
import { AddZoneComponent } from '../components/zone/add/add.component';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private isMobileSubject = new BehaviorSubject<boolean>(false);
  public isMobile$ = this.isMobileSubject.asObservable();

  private currentModal: HTMLIonModalElement | null = null;
  private isModalTransition = false;
  private currentModalComponent: any = null;

  private modalRouteComponentMap = new Map<string, any>([
    ['feedback', FeedbackComponent],
    ['profile', ProfileComponent],
    ['profile-edit', EditProfileComponent],
    ['rewards', DashboardRewardsComponent],
    ['about', AboutComponent],
    ['add-hub', HubComponent],
    ['devices-add', AddDeviceComponent],
    ['devices-new', NewDeviceComponent],
    ['device-edit', DeviceEditComponent],
    ['device-hub', HubEditComponent],
    ['add-zone', AddZoneComponent],
  ]);

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
    if (this.isModalTransition) {
      return;
    }
    const urlTree = this.router.parseUrl(event.url);
    const modalSegment = urlTree.root.children['modal'];
    const isMobile = await this.isMobile$.pipe(take(1)).toPromise();

    if (modalSegment && !isMobile) {
      const fullPath = modalSegment.segments.map(s => s.path).join('/');
      let component = this.modalRouteComponentMap.get(fullPath);
      if (!component) {
        const isStream = /^stream\/\d+$/.test(fullPath);
        const isStreamDevices = /^stream\/\d+\/devices$/.test(fullPath);
        const isAddHub = /^add-hub\/.+$/.test(fullPath);
        const isAddHubManually = /^add-hub\/.+\/search\/manually$/.test(
          fullPath
        );
        const isAddHubConnected = /^add-hub\/.+\/connected$/.test(fullPath);

        if (isStream) {
          component = ProjectComponent;
        }
        if (isStreamDevices) {
          component = ConnectDevicesComponent;
        }
        if (isAddHub) {
          component = FormAddHubAgreementComponent;
        }
        if (isAddHubManually) {
          component = FormAddHubManuallyComponent;
        }
        if (isAddHubConnected) {
          component = FormAddHubConnectedComponent;
        }
      }

      if (component) {
        if (this.currentModalComponent === component) {
          return;
        }

        this.isModalTransition = true;

        if (this.currentModal) {
          await this.currentModal.dismiss();
          this.currentModal = null;
          this.currentModalComponent = null;
        }

        history.replaceState({}, '', event.url);
        await this.openModal(component);
        this.isModalTransition = false;
      }
    }
  }

  private async openModal(component: any): Promise<void> {
    const modal = await this.modalCtrl.create({
      component,
      cssClass: 'modal-wrapper',
      componentProps: { isModal: true },
    });

    this.currentModal = modal;
    this.currentModalComponent = component;

    await modal.present();

    modal.onDidDismiss().then(() => {
      if (this.currentModal === modal) {
        this.currentModal = null;
        this.currentModalComponent = null;
        if (!this.isModalTransition) {
          const newUrl = this.router.url.replace(/\(modal:[^)]*\)/g, '');
          this.router.navigateByUrl(newUrl, {
            replaceUrl: true,
          });
        }
      }
    });
  }
}
