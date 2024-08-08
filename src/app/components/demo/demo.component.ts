import {Component, OnInit} from '@angular/core';
import {BaseComponent} from '../base.component';
import {UIService} from "../../services/ui.service";
import {BackendService} from "../../services/backend.service";
import {Router} from "@angular/router";
import {ErrorsService} from "../../services/errors.service";
import {StorageService} from "../../services/storage.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-dashboard',
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit {

  constructor(
    private router: Router,
    private ui: UIService,
    private backend: BackendService
              ) { }
    ngOnInit(): void {
      this.backend.userLogin({login: 'test@aydo.ai', password: '1qaz@WSX'}).then(() => {
        this.ui.afterLogin();
      })
      this.router.navigate(['/dashboard']);
    }

}
