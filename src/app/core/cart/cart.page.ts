import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../manager.service';
import { CartItem } from '../models/cartItem.model';
import { MapModalComponent } from 'src/app/shared/map-modal/map-modal.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart: CartItem[] = [];
  isLoading = false;
  constructor(
    private managerService: ManagerService,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  ionViewWillEnter() {
    this.loadCart();
  }

  get total() {
    let total = 0;
    this.cart.forEach((cartItem) => {
      total += cartItem.food.price * cartItem.quantity;
    });
    return total;
  }

  private loadCart() {
    this.isLoading = true;
    setTimeout(() => {
      this.cart = this.managerService.cart;
      this.isLoading = false;
    }, 1200);
  }

  alterQuantity(i: number, action: '+' | '-') {
    const cartItem = this.cart[i];
    // tslint:disable-next-line: curly
    if (cartItem === undefined) return;
    if (action === '+') {
      this.managerService.updateItemQuantity(i, cartItem.quantity + 1);
      this.cart = this.managerService.cart;
      // this.cart[i].quantity++;
    }
    if (action === '-') {
      if (cartItem.quantity > 1) {
        this.managerService.updateItemQuantity(i, cartItem.quantity - 1);
        this.cart = this.managerService.cart;
        // this.cart[i].quantity--;
      } else {
        this.managerService.removeItem(i);
        this.cart = this.managerService.cart;
      }
    }
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
            return this.managerService.finishOrder(data);
          }
        });
        return modal.present();
      });
  }
}
