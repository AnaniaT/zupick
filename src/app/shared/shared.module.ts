import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MapModalComponent } from './map-modal/map-modal.component';
import { QuickPageComponent } from './quick-page/quick-page.component';

@NgModule({
  declarations: [MapModalComponent, QuickPageComponent],
  imports: [CommonModule, IonicModule],
  exports: [MapModalComponent, QuickPageComponent],
})
export class SharedModule {}
