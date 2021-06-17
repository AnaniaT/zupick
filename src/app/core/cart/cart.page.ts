import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManagerService } from '../manager.service';
import { CartItem, CartItemInterface } from '../models/cartItem.model';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { ModalController, NavController } from '@ionic/angular';
import { CafeInterface } from '../models/cafe.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit, OnDestroy {
  cart: CartItemInterface[] = [];
  cartSub: Subscription;
  isLoading = false;
  constructor(
    private managerService: ManagerService,
    private modalCtrl: ModalController,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    this.cartSub = this.managerService.cart.subscribe((cart) => {
      this.cart = cart;
    });
  }
  ngOnDestroy() {
    this.cartSub.unsubscribe();
  }

  get total() {
    let total = 0;
    this.cart.forEach((cartItem) => {
      total += cartItem.food.price * cartItem.quantity;
    });
    return total;
  }

  alterQuantity(i: number, action: '+' | '-') {
    const cartItem = this.cart[i];
    // tslint:disable-next-line: curly
    if (cartItem === undefined) return;

    this.managerService.alterItemQuantity(cartItem, action);
  }

  onCheckout() {
    this.modalCtrl
      .create({
        id: 'checkout-modal',
        component: MapModalComponent,
        showBackdrop: true,
        componentProps: {
          isCheckout: true,
          centerCoords: { lat: 7.047185, lng: 38.478741, mark: false },
          modalTitle: 'Pick your location',
        },
      })
      .then((modal) => {
        modal.onDidDismiss().then(({ data, role }) => {
          if (role === 'done') {
            this.isLoading = true;
            this.managerService.finishOrder(data).subscribe(
              () => {
                this.navCtrl.navigateRoot('/home/cart/done');
                this.isLoading = false;
              },
              (err) => {
                console.log(err);
                console.log(err.message);
              }
            );
          }
        });
        return modal.present();
      });
  }
}
