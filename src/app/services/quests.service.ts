import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { RequestService } from './request.service';
import { BaseService } from '../models/base-service.interface';
import { environment } from '../../environments/environment';
import { QuestsModel } from '../models/quests.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestsService implements BaseService<QuestsModel> {

  constructor(private request: RequestService) {}

  get baseUrl(): string {
    return `${environment.main_url}/backend/v2/quests`;
  }

  // TODO: refactor request service, return observables
  getItems(): Observable<QuestsModel[]> {
    return from(
      this.request.get(this.baseUrl, {
        mainGroup: 'backend',
        method: 'get-all-quests'
      })
    );
  }
}
