import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from "../../services/storage.service";
import { ErrorsService } from "../../services/errors.service";

@Component({
  selector: 'app-auth-redirect',
  template: '',
  styles: [],
})
export class AuthRedirectComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  storage = inject(StorageService);
  errors = inject(ErrorsService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const userData = params['userData'];
      if (userData) {
        try {
          const decodedData = atob(userData);
          const userTokens = JSON.parse(decodedData);
          const token = userTokens.token;
          const refreshToken = userTokens.refreshToken;

          if (token && refreshToken) {
            this.storage.token = token;
            this.storage.refreshToken = refreshToken;
            this.storage.next();
          } else {
            this.handleError();
          }
        } catch (error) {
          this.handleError();
        }
      } else {
        this.handleError();
      }
    });
  }

  private handleError(): void {
    this.errors.showError('Not authenticated');
    this.router.navigate(['/main']);
  }
}
