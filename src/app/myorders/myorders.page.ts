import { Component, OnInit, OnDestroy } from '@angular/core';
import { ManagerService } from '../core/manager.service';
import { Order } from '../core/models/order.model';
import { CartItemInterface } from '../core/models/cartItem.model';
import { Subscription } from 'rxjs';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

// tslint:disable: curly

@Component({
  selector: 'app-myorders',
  templateUrl: './myorders.page.html',
  styleUrls: ['./myorders.page.scss'],
})
export class MyordersPage implements OnInit, OnDestroy {
  myorders: Order[] = [];
  myordersSub: Subscription;
  isLoading = false;
  constructor(private managerService: ManagerService) {}

  ngOnInit() {
    this.isLoading = true;
    this.myordersSub = this.managerService.orders.subscribe((orders) => {
      const reversedOrder = [];
      for (let i = orders.length - 1; i >= 0; i--) {
        reversedOrder.push(orders[i]);
      }
      this.myorders = reversedOrder;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.myordersSub.unsubscribe();
  }

  calcAmt(cart: CartItemInterface[]): number {
    let total = 0;
    cart.forEach((cartItem) => {
      total += cartItem.food.price * cartItem.quantity;
    });
    return total;
  }

  getStatusIcon(status: string): 'hourglass-outline' | 'checkmark-done' {
    if (status === 'ongoing') return 'hourglass-outline';
    else return 'hourglass-outline';
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
}
