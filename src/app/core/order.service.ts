import { Injectable } from '@angular/core';
import { Order } from './order.model';
import { BehaviorSubject } from 'rxjs';
import { take, tap, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private _orders = new BehaviorSubject<Order[]>([
    new Order(
      123,
      {
        name: 'Mehal Piassa',
        location: { lat: 7.051169305104845, lng: 38.478764475257776 },
      },
      {
        name: 'Home',
        location: { lat: 7.04524739949869, lng: 38.48126297129056 },
      },
      'Post card 3x'
    ),
    new Order(
      456,
      {
        name: 'Rome Piassa',
        location: { lat: 7.051169305104845, lng: 38.478764475257776 },
      },
      {
        name: 'Menharia',
        location: { lat: 7.04524739949869, lng: 38.48126297129056 },
      },
      'Post card 3x'
    ),
  ]);

  get orders() {
    return this._orders.asObservable();
  }

  addOrder(o: Order) {
    return this.orders.pipe(
      take(1),
      tap((orders) => {
        this._orders.next(orders.concat(o));
      })
    );
  }

  getOrder(orderId: any) {
    return this.orders.pipe(
      take(1),
      map((orders) => {
        return orders.find((o) => o.id === orderId) || null;
      }),
    );
  }
}
