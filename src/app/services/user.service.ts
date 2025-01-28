import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import {scan, shareReplay, startWith, Subject, switchMap} from "rxjs";

type User = {
    balance: string;
    email: string;
    wallet: string;
    firstname: string;
    lastname: string;
    id: number;
    is_verified: boolean;
    login: string;
    params: any;
    token: string;
    refresh_token: string;
    avatar?: {
      fileId: string;
      url: string;
    };
  };

@Injectable()
export class UserService {
  private readonly httpClient = inject(HttpClient);
  private readonly baseUrl = `${environment.main_url}/backend/v2/user`;

  private userPatch$ = new Subject<Partial<User>>();


  user$ = this.httpClient
      .get<User>(`${this.baseUrl}/info`)
      .pipe(
        switchMap((initialUser) =>
          this.userPatch$.pipe(
            scan(
              (acc, patch) =>
                ({ ...acc, ...patch }), initialUser)
            ,
            startWith(initialUser)
          )
        ),
        shareReplay({ refCount: true }),
      )
    ;

  updateUser(value: Partial<User>) {
    this.userPatch$.next(value);
  }

    requestDisposal() {
        return this.httpClient.delete(this.baseUrl);
    }
}
