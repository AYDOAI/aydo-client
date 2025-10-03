import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { BackendService } from '../../../services/backend.service';
import { UIService } from '../../../services/ui.service';
import { ErrorsService } from '../../../services/errors.service';
import { LoadingService } from '../../../services/loading.service';
import { MetaMaskService } from '../../../services/metamask.service';

@Component({
  selector: 'app-welcome-providers',
  templateUrl: './welcome-providers.component.html',
  styleUrl: './welcome-providers.component.scss',
})
export class WelcomeProvidersComponent implements OnInit {
  constructor(
    private router: Router,
    private backend: BackendService,
    private ui: UIService,
    private errors: ErrorsService,
    private loading: LoadingService,
    private metamask: MetaMaskService
  ) {}

  ngOnInit(): void {}

  public googleAuth(): void {
    if (this.ui.isOnline) {
      this.ui.googleLogin(this.ui.inviteId);
    } else {
      this.errors.showError(
        'There was an error connecting. Please check your internet connection and try again later.'
      );
    }
  }

  async handleAuth() {
    this.loading
      .showLoading$(
        this.metamask.signInWithMetaMask({ inviteId: this.ui.inviteId })
      )
      .subscribe(
        () => {
          this.ui.afterLogin();
        },
        err => {
          this.errors.showError(err.message);
        }
      );
  }

  async signInWithApple() {
    if (this.ui.isOnline) {
      this.ui.appleLogin(this.ui.inviteId);
    } else {
      this.errors.showError(
        'There was an error connecting. Please check your internet connection and try again later.'
      );
    }
  }

  public isDesktop() {
    return this.ui.isDesktop();
  }
}
