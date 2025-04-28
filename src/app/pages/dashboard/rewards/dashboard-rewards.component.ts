import { Component, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { IPagination } from '../../../models/pagination.interface';
import { finalize } from 'rxjs';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-dashboard-rewards',
  templateUrl: './dashboard-rewards.component.html',
  styleUrl: './dashboard-rewards.component.scss',
})
export class DashboardRewardsComponent extends BaseComponent {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;
  private pagination: IPagination = {
    page: 1,
    limit: 15,
  };
  private totalPages: number = 1;

  override onInit() {
    this.getRewards();
  }

  goBack() {
    this.navCtrl.navigateBack(['/dashboard']);
  }

  getRewards(e?: any): void {
    this.backend
      .userRewards(this.pagination)
      .pipe(
        finalize(() => {
          if (e) {
            e.target.complete();
          }
        })
      )
      .subscribe(data => {
        if (this.pagination.page > 1) {
          this.ui.rewards.push(...data.items);
        } else {
          this.ui.rewards = data.items;
        }
        this.totalPages = data.totalPages;
      });
  }

  refresh(e: any): void {
    this.pagination = {
      page: 1,
      limit: 10,
    };
    this.getRewards(e);
  }

  loadMore(event: any) {
    if (this.pagination.page < this.totalPages) {
      this.pagination.page++;
      this.getRewards(event);
    } else {
      event.target.complete();
      this.infiniteScroll.disabled = true;
    }
  }
}
