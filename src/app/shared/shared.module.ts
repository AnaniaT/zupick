import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { OrderModalComponent } from './order-modal/order-modal.component';

@NgModule({
  declarations: [OrderModalComponent],
  imports: [CommonModule, IonicModule],
  exports: [OrderModalComponent],
})
export class SharedModule {}
