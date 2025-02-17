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
    private request: RequestService
  ) {}

  public signInWithMetaMask(inviteId: string): Observable<any> {
    if (this.platform.is('ios') || this.platform.is('android')) {
      return this.signInWithMetaMaskMobile(inviteId);
    } else {
      return this.signInWithMetaMaskWeb(inviteId);
    }
  }

  private signInWithMetaMaskMobile(inviteId: string) {
    const timeoutPromise = (ms: number) =>
      new Promise((_, reject) =>
        setTimeout(
          () =>
            reject(
              new Error(
                'Connection timeout. Please make sure MetaMask is installed and check your internet connection.'
              )
            ),
          ms
        )
      );

    const connectWithTimeout = Promise.race([
      connect(config, { connector }),
      timeoutPromise(10000),
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
        from(this.metamaskGetNonce(address, inviteId)).pipe(
          map(nonceResponse => ({ address, nonce: nonceResponse.nonce }))
        )
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
        from(this.metamaskVerifySignedMessage(address, signature)).pipe(
          map(response => ({ address, signature, tokenData: response.user }))
        )
      ),
      tap(({ tokenData }) => {
        this.storage.token = tokenData.token;
        this.storage.refreshToken = tokenData.refresh_token;
        this.storage.next();
      }),
      catchError(error => {
        console.error('MetaMask sign-in error:', error);
        return throwError(
          () => new Error(error.message || 'MetaMask authentication failed.')
        );
      })
    );
  }

  private signInWithMetaMaskWeb(inviteId: string) {
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
        this.metamaskGetNonce(ethereum.selectedAddress, inviteId)
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
        this.metamaskVerifySignedMessage(ethereum.selectedAddress, sig)
      ),
      switchMap(async response => {
        this.storage.token = response.user.token;
        this.storage.refreshToken = response.user.refresh_token;
        this.storage.next();
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
}
