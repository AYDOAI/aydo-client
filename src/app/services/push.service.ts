import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import OneSignal, { OSNotificationPermission } from 'onesignal-cordova-plugin';
import { RequestService } from './request.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PushService {
  constructor(
    private platform: Platform,
    private alertCtrl: AlertController,
    private request: RequestService
  ) {}

  init() {
    this.platform.ready().then(async () => {
      if (Capacitor.getPlatform() === 'web') return;

      this.initOneSignal();
      await this.initPermissions();
      await this.initUser();
    });
  }

  private initOneSignal() {
    OneSignal.initialize(environment.onesignal.appId);
    OneSignal.Notifications.addEventListener('click', (event: any) => {
      console.log(event);
    });
  }

  private async initPermissions() {
    try {
      if (Capacitor.getPlatform() === 'ios') {
        const iosPermission = await OneSignal.Notifications.permissionNative();
        if (iosPermission !== OSNotificationPermission.Authorized) {
          await this.checkAndRequestPermission();
        } else {
          await this.requestPermission();
        }
      } else {
        await this.checkAndRequestPermission();
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async checkAndRequestPermission() {
    const hasPermission = await OneSignal.Notifications.getPermissionAsync();
    if (!hasPermission) {
      this.showPermissionAlert();
    }
  }

  private async requestPermission() {
    try {
      const canRequest = await OneSignal.Notifications.canRequestPermission();
      if (canRequest) {
        await OneSignal.Notifications.requestPermission(true);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private showPermissionAlert() {
    this.alertCtrl
      .create({
        header: 'Allow notifications',
        message: 'Please allow notifications for updates and offers.',
        buttons: [
          {
            text: 'Don’t Allow',
            role: 'cancel',
            handler: () => console.log('permission denied'),
          },
          {
            text: 'Allow',
            handler: () => this.requestPermission(),
          },
        ],
      })
      .then(alert => alert.present());
  }

  private async initUser() {
    try {
      this.request
        .post(
          `${environment.main_url}/backend/v2/onesignal/register`,
          {},
          {
            mainGroup: 'backend',
            method: 'register-onesignal',
          }
        )
        .subscribe(response => {
          if (response?.uid) {
            OneSignal.login(response.uid);
          }
        });
    } catch (e) {
      console.error(e);
    }
  }

  async logout() {
    try {
      OneSignal.logout();
    } catch (e) {
      console.error(e);
    }
  }
}
