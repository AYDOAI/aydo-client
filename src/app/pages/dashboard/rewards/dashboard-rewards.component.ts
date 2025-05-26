import { Component, inject, ViewChild } from '@angular/core';
import { BaseComponent } from '../../../components/base.component';
import { IPagination } from '../../../models/pagination.interface';
import { finalize, forkJoin, map } from 'rxjs';
import { IonInfiniteScroll } from '@ionic/angular';
import { UserService } from '../../../services/user.service';
import { take, tap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-rewards',
  templateUrl: './dashboard-rewards.component.html',
  styleUrl: './dashboard-rewards.component.scss',
})
export class DashboardRewardsComponent extends BaseComponent {
  @ViewChild(IonInfiniteScroll) infiniteScroll!: IonInfiniteScroll;

  public userService = inject(UserService);
  public balance$ = this.userService.user$.pipe(
    map(user => user?.balance || 0)
  );

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

  getRewards(): void {
    this.backend.userRewards(this.pagination).subscribe(data => {
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

    this.userService.reloadUser();

    const user$ = this.userService.user$.pipe(take(1));
    const rewards$ = this.backend.userRewards(this.pagination).pipe(
      tap(data => {
        this.ui.rewards = data.items;
        this.totalPages = data.totalPages;
      })
    );

    forkJoin([user$, rewards$])
      .pipe(finalize(() => e.target.complete()))
      .subscribe();
  }

  loadMore(event: any) {
    if (this.pagination.page < this.totalPages) {
      this.pagination.page++;
      this.getRewards();
    } else {
      event.target.complete();
      this.infiniteScroll.disabled = true;
    }
  }
}
