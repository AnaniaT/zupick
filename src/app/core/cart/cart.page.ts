import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../manager.service';
import { CartItem } from '../models/cartItem.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
})
export class CartPage implements OnInit {
  cart: CartItem[] = [];
  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.cart = this.managerService.cart;
  }

  ionViewWillEnter() {
    this.cart = this.managerService.cart;
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
}
