import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { BaseService } from '../models/base-service.interface';
import { QuestsModel } from '../models/quests.interface';
import { WsRequestService } from './ws-request.service';

@Injectable({
  providedIn: 'root',
})
export class QuestsService implements BaseService<QuestsModel> {
  constructor(private request: WsRequestService) {}

  get baseUrl(): string {
    return `/backend/v2/quests`;
  }

  // TODO: refactor request service, return observables
  getItems(): Observable<QuestsModel[]> {
    return from(
      this.request.get<QuestsModel[]>(this.baseUrl, {
        mainGroup: 'backend',
        method: 'get-all-quests',
      })
    );
  }
}
