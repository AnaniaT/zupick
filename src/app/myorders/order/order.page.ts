import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/core/models/order.model';
import { ManagerService } from 'src/app/core/manager.service';
import { NavController, ModalController } from '@ionic/angular';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// tslint:disable: curly

@Component({
  selector: 'app-order',
  templateUrl: './order.page.html',
  styleUrls: ['./order.page.scss'],
})
export class OrderPage implements OnInit {
  order: Order = null;
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
      this.managerSevice.getOrder(id).subscribe((order) => {
        this.order = order;
        if (!this.order) {
          return this.navCtrl.back();
        }
        this.isLoading = false;
      });
    });
  }

  getTotal() {
    let total = 0;
    this.order.cart.forEach((cartItem) => {
      total += cartItem.food.price * cartItem.quantity;
    });
    return total;
  }

  serializeTime(t: string) {
    const dateTime = dayjs(t);
    const diff = dayjs().diff(dateTime);

    let fStr = null;
    // tslint:disable-next-line: quotemark
    if (diff > 1000 * 60 * 60 * 24 * 365) fStr = "MMM D'YY";
    else if (diff > 1000 * 60 * 60 * 24 * 30) fStr = 'ddd, MMM D';
    else if (diff > 1000 * 60 * 60 * 24 * 7) fStr = 'MMM D, hh:mm a';
    else if (diff > 1000 * 60 * 60 * 24 * 1) fStr = 'ddd, hh:mm a';
    // else is not needed

    if (fStr) return 'On ' + dateTime.format(fStr);
    return dateTime.fromNow();
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
