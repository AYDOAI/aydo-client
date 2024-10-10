import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from "../../services/storage.service";
import { ErrorsService } from "../../services/errors.service";

@Component({
  selector: 'app-google-auth-redirect',
  template: '',
  styles: [],
})
export class GoogleAuthRedirectComponent implements OnInit {
  route = inject(ActivatedRoute);
  router = inject(Router);
  storage = inject(StorageService);
  errors = inject(ErrorsService);

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const refreshToken = params['refreshToken'];
      if (token && refreshToken) {
        this.storage.token = token;
        this.storage.refreshToken = refreshToken;
        this.router.navigate(['/']);
      } else {
        this.errors.showError('Not authenticated')
        this.router.navigate(['/sign-up']);
      }
    });
  }
}
