import { Component, OnInit } from '@angular/core';
import { ManagerService } from '../core/manager.service';
import { Order } from '../core/models/order.model';
import { CartItem } from '../core/models/cartItem.model';

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit {
  myorders: Order[] = [];
  isLoading = false;
  constructor(private managerService: ManagerService) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.myorders = this.managerService.orders;
    // this.isLoading = true;
    // setTimeout(() => {
    //   this.myorders = this.managerService.orders;
    //   this.isLoading = false;
    // }, 750);
  }

  calcAmt(cart: CartItem[]): number {
    return this.managerService.calcAmt(cart);
  }

  getStat(order: Order): 'hourglass-outline' | 'checkmark-done' {
    return this.managerService.getStat(order);
  }
}
