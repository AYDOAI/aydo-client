import { Component, inject } from '@angular/core';
import {BaseComponent} from '../../base.component';
import {DataStream} from '../../../services/backend.service';
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent extends BaseComponent {

  public dataStream!: DataStream;
  public streaming: boolean = false;

  private route = inject(ActivatedRoute);

  override onInit() {
    const projectId = Number(this.route.snapshot.params['project']);
    this.backend.getDataStreams().then((response) => {
      this.dataStream = response.items[projectId];
    }).catch(() => {
    });
  }

  public copy(): void {
    // TODO component, notification "text copied"?
    navigator.clipboard.writeText('test').then(() => {
    }).catch(err => {
      console.error(err);
    });
  }
}
