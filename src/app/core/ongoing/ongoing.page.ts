import { Component, OnInit, OnDestroy } from '@angular/core';
import { OrdersService } from '../order.service';
import { Order } from '../order.model';
import { interval, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-ongoing',
  templateUrl: './ongoing.page.html',
  styleUrls: ['./ongoing.page.scss'],
})
export class OngoingPage implements OnInit {
  orders: Order[] = [];

  luding = '.';
  ludingSub: Subscription;

  constructor(private ordersService: OrdersService) {}

  ngOnInit() {
    this.ordersService.orders.subscribe((orders) => {
      this.orders = orders;
    });
  }

  ionViewWillLeave() {
    this.ludingSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.ordersService.getOrder(4564).subscribe((order) => {
      console.log(order);
    });

    // Handles the ellips thing on the status of the orders
    this.ludingSub = interval(600)
      .pipe(
        tap((_) => {
          if (this.luding.length < 3) {
            return (this.luding += '.');
          }
          this.luding = '.';
        })
      )
      .subscribe();
  }
}
