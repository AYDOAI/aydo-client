import {Component, Inject, OnInit} from '@angular/core';
import {
  connect,
  disconnect,
  getAccount,
  injected,
  signMessage,
} from "@wagmi/core";
import { http, createConfig } from "@wagmi/core";
import { mainnet, sepolia } from "@wagmi/core/chains";
import { Router } from "@angular/router";
import {BackendService} from "../../../services/backend.service";
import detectEthereumProvider from '@metamask/detect-provider';
import { environment } from "../../../../environments/environment";

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

  private provider: any;
  constructor(
    private router: Router,
    private backend: BackendService,
  ) { }

  ngOnInit(): void {

  }

  public googleAuth(): void {
    window.location.href = `${environment.main_url}/backend/v2/user/google/login`
  }

  async handleAuth() {
    this.backend.signInWithMetaMask().subscribe(
      () => {
        this.router.navigateByUrl('/dashboard');
      },
      (err) => {
        console.log(err);
      }
    );
  }

}
