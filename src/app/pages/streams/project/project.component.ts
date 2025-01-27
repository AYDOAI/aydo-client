import { Component, inject } from '@angular/core';
import {BaseComponent} from '../../../components/base.component';
import {DataStream} from '../../../services/backend.service';
import { ActivatedRoute } from "@angular/router";
import { finalize } from "rxjs";

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss'
})
export class ProjectComponent extends BaseComponent {

  public dataStream: DataStream | null = null;

  private route = inject(ActivatedRoute);

  override onInit() {
    const id = Number(this.route.snapshot.params['id']);
    this.backend.getDataStreamById(id).subscribe((data) => {
      this.dataStream = data;
    })
  }

  public copy(text: string): void {
    // TODO component, notification "text copied"?
    if (text) {
      navigator.clipboard.writeText(text).then(() => {
      }).catch(err => {
        console.error(err);
      });
    }
  }

  public toggle(): void {
    if (this.dataStream) {
      this.ui.lockBtn('streaming');
      this.backend.toggleDataStream(this.dataStream.id).pipe(finalize(() => this.ui.unlockBtn('streaming'))).subscribe((data) => {
        setTimeout(() => {
          (this.dataStream as { status: number }).status = data.status;
        }, 200);
      })
    }
  }
}
