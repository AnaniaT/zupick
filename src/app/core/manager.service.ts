import { Injectable } from '@angular/core';
import { Cafe } from './models/cafe.model';
import { FoodItem } from './models/item.model';
import { data } from './db';
import { CartItem } from './models/cartItem.model';
import { Order } from './models/order.model';
import { NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  public cafes: Cafe[] = [];
  public foods: FoodItem[] = [];
  public cart: CartItem[] = [];
  public categories: string[];

  public orders: Order[] = [];

  constructor(private navCtrl: NavController) {
    for (const cafe of data.cafes) {
      const foodList: FoodItem[] = [];
      for (const fId of cafe.foodList) {
        const f = data.foods[fId];
        foodList.push(
          new FoodItem(fId, f.name, f.price, f.imgAddr, f.desc, f.category)
        );
      }

      const c = new Cafe({
        id: data.cafes.indexOf(cafe),
        name: cafe.name,
        foodList,
      });

      this.cafes.push(c);
    }

    for (const f of data.foods) {
      this.foods.push(
        new FoodItem(
          data.foods.indexOf(f),
          f.name,
          f.price,
          f.imgAddr,
          f.desc,
          f.category
        )
      );
    }

    this.categories = data.categories;
    // this.cart.push(new CartItem(this.cafes[0].foodList[0], 1, this.cafes[0]));
    // this.orders = [
    //   {
    //     cart: [
    //       new CartItem(this.cafes[0].foodList[0], 2, this.cafes[0]),
    //       new CartItem(this.cafes[2].foodList[1], 3, this.cafes[2]),
    //     ],
    //     location: { lat: 7.043778, lng: 38.479427 },
    //   },
    //   {
    //     cart: [
    //       new CartItem(this.cafes[1].foodList[2], 1, this.cafes[1]),
    //       new CartItem(this.cafes[3].foodList[3], 4, this.cafes[3]),
    //     ],
    //     location: { lat: 7.043778, lng: 38.479427 },
    //   },
    // ];
  }

  // Cafe related
  getCafe(id: string | number): Cafe {
    for (const cafe of this.cafes) {
      // tslint:disable-next-line: curly
      if (cafe.id === id) return cafe;
    }
    return null;
  }

  getAvailableCafes(foodId: number) {
    return this.cafes.filter((c) => !!c.foodList.find((f) => f.id === foodId));
  }

  // Food related
  getFood(id: number): FoodItem {
    for (const f of this.foods) {
      // tslint:disable-next-line: curly
      if (f.id === id) return f;
    }
    return null;
  }

  findFood(searchTerm: string) {
    searchTerm = searchTerm.trim().toLowerCase();
    return this.foods.filter((f) =>
      f.name.toLowerCase().startsWith(searchTerm)
    );
  }

  getFoodsByCategory(categoryId: number) {
    return this.foods.filter((f) => f.category === categoryId);
  }

  // Category related
  getCategory(id: number) {
    return data.categories[id] || null;
  }

  // Cart related
  addToCart(food: FoodItem, quantity: number, cafe: Cafe) {
    this.cart.push(new CartItem(food, quantity, cafe));
  }

  isFoodInCart(foodId: number) {
    const cartItem = this.cart.find((cI) => cI.food.id === foodId);
    return cartItem !== undefined;
  }

  updateItemQuantity(i: number, quantity: number) {
    if (this.cart[i] && quantity > 0) {
      this.cart[i].quantity = quantity;
    }
  }

  removeItem(i: number) {
    if (this.cart[i]) {
      this.cart = this.cart.filter((_, index) => index !== i);
    }
  }

  // Order Related
  finishOrder({ lat, lng }) {
    this.orders.push({
      cart: this.cart,
      location: { lat, lng },
    });

    this.cart = [];
    this.navCtrl.navigateRoot('/home/cart/done');
  }

  getOrder(index: number) {
    return this.orders[index] || null;
  }

  calcAmt(cart: CartItem[]): number {
    let total = 0;
    cart.forEach((cartItem) => {
      total += cartItem.food.price * cartItem.quantity;
    });
    return total;
  }

  getStat(order: Order): 'hourglass-outline' | 'checkmark-done' {
    // check if the order is done and decide
    return 'hourglass-outline';
  }
}
