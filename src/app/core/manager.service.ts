// tslint:disable: variable-name // removes the warning for the underscored var names
import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, tap, take, switchMap } from 'rxjs/operators';
import { CafeInterface } from './models/cafe.model';
import { FoodItemInterface } from './models/item.model';
import { CartItemInterface } from './models/cartItem.model';
import { Order } from './models/order.model';
import { Observable, BehaviorSubject } from 'rxjs';
import {
  ADD_ORDER_MUTATION,
  GET_CATEGORIES,
  GET_ORDERS,
  GET_FOOD,
  SEARCH_FOOD,
  FILTER_FOOD_BY_CATEGORY,
} from './graphQueries';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  private _cart = new BehaviorSubject<CartItemInterface[]>([]);
  get cart() {
    return this._cart.asObservable();
  }

  private _orders = new BehaviorSubject<Order[]>([]);
  private _ordersLoaded = false;
  get orders() {
    if (!this._ordersLoaded) {
      return this.apollo
        .query<any>({
          query: GET_ORDERS,
        })
        .pipe(
          take(1),
          switchMap((res) => {
            if (!res.data.orders) {
              throw new Error('Something went wrong');
            }
            this._orders.next(res.data.orders);
            return this._orders.asObservable();
          })
        );
    }
    return this._orders.asObservable();
  }

  constructor(private apollo: Apollo) {}

  get categories() {
    return this.apollo
      .query<any>({
        query: GET_CATEGORIES,
      })
      .pipe(
        map((res) => {
          if (!res.data.categories) {
            throw new Error('Something went wrong');
          }
          return res.data.categories;
        })
      );
  }

  // Food related (observable data interaction)
  getFood(id: string): Observable<FoodItemInterface> {
    return this.apollo
      .query<any>({
        query: GET_FOOD,
        variables: { id },
      })
      .pipe(
        map((res) => {
          if (!res.data.food) {
            throw new Error('Something went wrong while searching for food');
          }
          return res.data.food;
        })
      );
  }

  searchFood(searchTerm: string): Observable<FoodItemInterface[]> {
    return this.apollo
      .query<any>({
        query: SEARCH_FOOD,
        variables: { searchTerm: searchTerm.trim() },
      })
      .pipe(
        map((res) => {
          if (!res.error) {
            return res.data.foods;
          }
          throw new Error('Something went wrong while searching for food');
        })
      );
  }

  getFoodsByCategory(categoryId: string): Observable<FoodItemInterface[]> {
    return this.apollo
      .query<any>({
        query: FILTER_FOOD_BY_CATEGORY,
        variables: { categoryId },
      })
      .pipe(
        map((res) => {
          if (!res.error) {
            return res.data.foods;
          }
          throw new Error('Something went wrong');
        })
      );
  }

  // Cart related (also non-observable data interaction)
  addToCart(food: FoodItemInterface, quantity: number, cafe: CafeInterface) {
    return this.cart.pipe(
      take(1),
      map((cart) => {
        // Check if food is already in cart (didnt use the isFoodInCart
        // method to not subscribe the subject twice)
        const cartItem = cart.find((cI) => cI.food.id === food.id);
        if (cartItem === undefined) {
          this._cart.next(cart.concat({ food, quantity, cafe }));
        }
      })
    );
  }

  isFoodInCart(foodId: string) {
    let cartItem: CartItemInterface;
    this.cart.pipe(take(1)).subscribe((cart) => {
      cartItem = cart.find((cI) => cI.food.id === foodId);
    });
    return cartItem !== undefined;
  }

  alterItemQuantity(cartItem: CartItemInterface, action: '+' | '-') {
    if (action === '+') {
      this.cart.pipe(take(1)).subscribe((cart) => {
        const i = cart.findIndex((cI) => cI.food.id === cartItem.food.id);
        if (i >= 0) {
          cart[i].quantity++;
          this._cart.next(cart);
        }
      });
      return;
    }
    // NOTE that action is clearly '-' from this line on
    if (cartItem.quantity >= 2) {
      this.cart.pipe(take(1)).subscribe((cart) => {
        const i = cart.findIndex((cI) => cI.food.id === cartItem.food.id);
        if (i >= 0) {
          cart[i].quantity--;
          this._cart.next(cart);
        }
      });
      return;
    }
    // cartItem is removed entirely since its quantity is 1
    this.cart.pipe(take(1)).subscribe((cart) => {
      const i = cart.findIndex((cI) => cI.food.id === cartItem.food.id);
      if (i >= 0) {
        this._cart.next(cart.filter((_, index) => index !== i));
      }
    });
  }

  // Order Related
  finishOrder({ lat, lng }): Observable<any> {
    let o: Order = null;
    let oldOrders: Order[] = [];
    return this.cart.pipe(
      take(1),
      switchMap((cart) => {
        o = { cart, location: { lat, lng } };
        return this.orders;
      }),
      take(1),
      switchMap((orders) => {
        oldOrders = orders;
        const cartInput = [];
        for (const c of o.cart) {
          cartInput.push({
            foodId: c.food.id,
            cafeId: c.cafe.id,
            quantity: c.quantity,
          });
        }
        return this.apollo.mutate<any>({
          mutation: ADD_ORDER_MUTATION,
          variables: {
            cart: cartInput,
            location: o.location,
          },
          // Update the cache after the mutation (handles state update for the frontend)
          update: (cache, { data: { addOrder: newOrder } }) => {
            let oldData: { orders: Order[] };
            oldData = cache.readQuery({ query: GET_ORDERS });
            cache.writeQuery({
              query: GET_ORDERS,
              data: {
                orders: [...oldData.orders, newOrder],
              },
            });
          },
        });
      }),
      take(1),
      tap(() => {
        this._cart.next([]);
        // this._orders.next doesnt have to be called it is cached and also updated above
        // however the cache is not persistent but it is handled by the ngOnInit on the myorders.page
        // which fetchs the data from the db using the manager.service. then the data is automatically cached by apollo.
      })
    );
  }

  getOrder(id: string) {
    return this.orders.pipe(
      take(1),
      map((orders) => {
        return orders.find((o) => o.id === id) || null;
      })
    );
  }
}
