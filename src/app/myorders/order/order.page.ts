import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/core/models/order.model';
import { ManagerService } from 'src/app/core/manager.service';
import { NavController, ModalController } from '@ionic/angular';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  order: Order = null;
  orderID: number = null;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private managerSevice: ManagerService,
    private navCtrl: NavController,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.route.params.subscribe(({ id }) => {
      this.isLoading = true;
      // Make sure that the param.id is all numbers
      if (/^[0-9]+$/.test(id)) {
        this.orderID = +id;
        return setTimeout(() => {
          this.order = this.managerSevice.getOrder(id);
          if (!this.order) {
            this.navCtrl.back();
          }
          this.isLoading = false;
        }, 750);
      }
      this.navCtrl.back();
    });
  }

  get total() {
    return this.managerSevice.calcAmt(this.order.cart);
  }

  showDest() {
    this.modalCtrl
      .create({
        component: MapModalComponent,
        showBackdrop: true,
        componentProps: {
          centerCoords: { ...this.order.location, mark: true },
          isCheckout: false,
          modalTitle: 'Destination',
        },
      })
      .then((modal) => {
        return modal.present();
      });
  }
}
