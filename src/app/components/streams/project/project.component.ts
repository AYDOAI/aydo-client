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
    const id = Number(this.route.snapshot.params['id']);
    this.backend.getDataStreamById(id).then((data) => {
      this.dataStream = data;
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
