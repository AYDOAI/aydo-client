import { Injectable } from '@angular/core';
import { catchError, from, Observable, of, throwError } from 'rxjs';
import {
  connect,
  createConfig,
  getAccount,
  getWalletClient,
  http,
} from '@wagmi/core';
import { map, switchMap, tap } from 'rxjs/operators';
import detectEthereumProvider from '@metamask/detect-provider';
import { environment } from '../../environments/environment';
import { StorageService } from './storage.service';
import { Platform } from '@ionic/angular';
import { LoadingService } from './loading.service';
import { RequestService } from './request.service';
import { mainnet, sepolia } from '@wagmi/core/chains';
import { metaMask } from '@wagmi/connectors';
import { UIService } from './ui.service';

export const config = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

export const connector = metaMask();

@Injectable({ providedIn: 'root' })
export class MetaMaskService {
  constructor(
    private storage: StorageService,
    private platform: Platform,
    private loading: LoadingService,
    private request: RequestService,
    private ui: UIService
  ) {}

  public signInWithMetaMask(options: {
    inviteId?: string;
    linkOnly?: boolean;
  }): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      return this.signInWithMetaMaskMobile(options);
    } else {
      return this.signInWithMetaMaskWeb(options);
    }
  }

  private signInWithMetaMaskMobile(options: {
    inviteId?: string;
    linkOnly?: boolean;
  }) {
    const connectionTimeoutMs = 10000;
    let connectionTimeout: ReturnType<typeof setTimeout> | null = null;

    const timeoutPromise = new Promise((_, reject) => {
      const startTimer = () => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
        }

        connectionTimeout = setTimeout(() => {
          if (this.ui.isAppFocused$.value) {
            reject(
              new Error(
                'Connection timeout. Please make sure MetaMask is installed and check your internet connection.'
              )
            );
          }
        }, connectionTimeoutMs);
      };

      const stopTimer = () => {
        if (connectionTimeout) {
          clearTimeout(connectionTimeout);
          connectionTimeout = null;
        }
      };

      const appFocusedSubscription$ = this.ui.isAppFocused$.subscribe(
        isFocused => {
          if (isFocused) {
            startTimer();
          } else {
            stopTimer();
          }
        }
      );

      if (this.ui.isAppFocused$.value) {
        startTimer();
      }

      return () => {
        stopTimer();
        appFocusedSubscription$.unsubscribe();
      };
    });

    const connectWithTimeout = Promise.race([
      connect(config, { connector }),
      timeoutPromise,
    ]);

    return from(connectWithTimeout).pipe(
      switchMap(() => {
        const account = getAccount(config);
        if (!account.address) {
          throw new Error('No connected account found');
        }
        return of(account.address);
      }),
      switchMap(address =>
        from(
          options.linkOnly
            ? this.getLinkNonce()
            : this.metamaskGetNonce(address, options.inviteId || '')
        ).pipe(map(nonceResponse => ({ address, nonce: nonceResponse.nonce })))
      ),
      switchMap(({ address, nonce }) =>
        from(getWalletClient(config)).pipe(
          switchMap(provider => {
            if (!provider) {
              throw new Error('Failed to get wallet provider.');
            }

            const signer = provider.account.address;
            return from(
              provider.request({
                method: 'personal_sign',
                params: [`0x${this.toHex(nonce)}`, signer],
              })
            ).pipe(
              map(signature => {
                if (!signature) {
                  throw new Error(
                    'You declined the signature request. Please try again.'
                  );
                }
                return { address: signer, signature };
              })
            );
          })
        )
      ),
      switchMap(({ address, signature }) =>
        from(
          options.linkOnly
            ? this.linkWallet(address, signature)
            : this.metamaskVerifySignedMessage(address, signature)
        ).pipe(
          map(response => ({ address, signature, tokenData: response.user }))
        )
      ),
      tap(({ tokenData }) => {
        if (!options.linkOnly) {
          this.storage.token = tokenData.token;
          this.storage.refreshToken = tokenData.refresh_token;
          this.storage.next();
        }
      }),
      catchError(error => {
        console.error('MetaMask sign-in error:', error);
        return throwError(
          () => new Error(error.message || 'MetaMask authentication failed.')
        );
      })
    );
  }

  private signInWithMetaMaskWeb(options: {
    inviteId?: string;
    linkOnly?: boolean;
  }) {
    let ethereum: any;

    return from(detectEthereumProvider()).pipe(
      switchMap(async provider => {
        if (!provider) {
          throw new Error('Please install MetaMask');
        }
        ethereum = provider;
        return await ethereum.request({ method: 'eth_requestAccounts' });
      }),
      switchMap(() =>
        options.linkOnly
          ? this.getLinkNonce()
          : this.metamaskGetNonce(
              ethereum.selectedAddress,
              options.inviteId || ''
            )
      ),
      switchMap(
        async response =>
          await ethereum.request({
            method: 'personal_sign',
            params: [
              `0x${this.toHex(response.nonce)}`,
              ethereum.selectedAddress,
            ],
          })
      ),
      switchMap(sig =>
        options.linkOnly
          ? this.linkWallet(ethereum.selectedAddress, sig)
          : this.metamaskVerifySignedMessage(ethereum.selectedAddress, sig)
      ),
      switchMap(async response => {
        if (!options.linkOnly) {
          this.storage.token = response.user.token;
          this.storage.refreshToken = response.user.refresh_token;
          this.storage.next();
        }
      })
    );
  }

  private toHex(stringToConvert: string) {
    return stringToConvert
      .split('')
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('');
  }

  private metamaskGetNonce(address: any, inviteId: string): Observable<any> {
    return this.request.post(
      `${environment.main_url}/backend/v2/user/metamask/get-nonce`,
      { address, inviteId },
      {
        mainGroup: 'backend',
        method: 'metamask-get-nonce',
        ignoreError: true,
      }
    );
  }

  private metamaskVerifySignedMessage(address: any, sig: any): Observable<any> {
    const data = { address: address, sig: sig };
    return this.request.post(
      `${environment.main_url}/backend/v2/user/metamask/verify`,
      { data },
      {
        mainGroup: 'backend',
        method: 'metamask-verify-signed-message',
      }
    );
  }

  private getLinkNonce(): Observable<{ nonce: string }> {
    return this.request.post(
      `${environment.main_url}/backend/v2/user/metamask/get-link-nonce`,
      {},
      {
        mainGroup: 'backend',
        method: 'metamask-get-link-nonce',
      }
    );
  }

  private linkWallet(address: string, sig: string): Observable<void> {
    return this.request.post(
      `${environment.main_url}/backend/v2/user/metamask/link-wallet`,
      { address, sig },
      {
        mainGroup: 'backend',
        method: 'metamask-link-wallet',
      }
    );
  }
}
