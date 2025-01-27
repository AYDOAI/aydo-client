import {Component, OnInit} from '@angular/core';
import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { Router } from "@angular/router";
import {BackendService} from "../../../services/backend.service";
import { UIService } from "../../../services/ui.service";
import { ErrorsService } from "../../../services/errors.service";
import { LoadingService } from '../../../services/loading.service';

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
    if (this.ui.isOnline) {
      this.backend.appleLogin(this.ui.inviteId);
    } else {
      this.errors.showError('There was an error connecting. Please check your internet connection and try again later.');
    }
  }

}
