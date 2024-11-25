import {Component, OnInit} from '@angular/core';
import {UIService} from "../../services/ui.service";
import {BackendService} from "../../services/backend.service";
import {Router} from "@angular/router";
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-demo',
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
      this.router.navigate([environment.index_url]);
    }

}
