import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrderModalComponent } from './order-modal/order-modal.component';
import { MapModalComponent } from './map-modal/map-modal.component';

@NgModule({
  declarations: [OrderModalComponent, MapModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [OrderModalComponent],
})
export class SharedModule {}
