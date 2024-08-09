import { Component, OnInit } from '@angular/core';
import { take, timer } from "rxjs";

@Component({
  selector: 'app-automatically',
  templateUrl: './automatically.component.html',
})
export class AutomaticallyComponent implements OnInit {
  public state: 'search' | 'found' | 'add' = 'search';

  // DEMO
  public ngOnInit(): void {
    timer(5000).pipe(take(1)).subscribe(_ => this.state = 'found')
  }
}
