import { NgModule } from '@angular/core';
import { ContentComponent } from './content.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [ContentComponent],
  imports: [IonicModule, CommonModule],
  exports: [ContentComponent]
})
export class ContentModule {}
