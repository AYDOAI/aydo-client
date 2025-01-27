import {Component, OnInit} from '@angular/core';
import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { Router } from "@angular/router";
import {BackendService} from "../../../services/backend.service";
import { UIService } from "../../../services/ui.service";
import { ErrorsService } from "../../../services/errors.service";
import { LoadingService } from '../../../services/loading.service';
import { SignInWithApple } from '@capacitor-community/apple-sign-in';
import { Platform } from "@ionic/angular";
import { window } from "rxjs";
import { environment } from "../../../../environments/environment";
import { InAppBrowser } from "@awesome-cordova-plugins/in-app-browser/ngx";

declare global {
  interface Window {
    AppleID: any;
  }
}

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

@Component({
  selector: 'app-welcome-providers',
  templateUrl: './welcome-providers.component.html',
  styleUrl: './welcome-providers.component.scss'
})
export class WelcomeProvidersComponent implements OnInit   {

  constructor(
    private router: Router,
    private backend: BackendService,
    private ui: UIService,
    private errors: ErrorsService,
    private loading: LoadingService,
    private platform: Platform,
    private iab: InAppBrowser,
  ) { }

  ngOnInit(): void {

  }

  public googleAuth(): void {
    if (this.ui.isOnline) {
      this.backend.googleLogin(this.ui.inviteId);
    } else {
      this.errors.showError('There was an error connecting. Please check your internet connection and try again later.');
    }
  }

  async handleAuth() {
    this.loading.showLoading$(this.backend.signInWithMetaMask(this.ui.inviteId)).subscribe(
      () => {
      },
      (err) => {
        this.errors.showError(err.message);
      }
    );
  }

  async signInWithApple() {
    // if (this.platform.is('ios')) {
    //   const { response } = await SignInWithApple.authorize({
    //     clientId: 'ai.aydo.app.apple',
    //     scopes: 'email',
    //     redirectURI: 'https://app.test.aydo.ai',
    //   });
    //   const { identityToken } = response;
    // } else {
      const url = `${environment.main_url}/backend/v2/user/apple/login`;
      const browser = this.iab.create(url);
    //   // if (typeof window !== 'undefined' && window.AppleID) {
    //   //   window.AppleID.auth.init({
    //   //     clientId: '123',
    //   //     scope: 'email',
    //   //     redirectURI: '123',
    //   //   });
    //   //   window.AppleID.auth.signIn().then((response: any) => {
    //   //     console.log(response);
    //   //   }).catch((error: any) => {
    //   //     console.error('Apple login error:', error);
    //   //   });
    //   // }
    // }
  }

}
