import { Injectable } from '@angular/core';
import { Cafe } from './models/cafe.model';
import { FoodItem } from './models/item.model';
import { data } from './db';
import { CartItem } from './models/cartItem.model';

@Injectable({
  providedIn: 'root',
})
export class ManagerService {
  public cafes: Cafe[] = [];
  public foods: FoodItem[] = [];
  public cart: CartItem[] = [];

  constructor() {
    for (const cafe of data.cafes) {
      const foodList: FoodItem[] = [];
      for (const fId of cafe.foodList) {
        const f = data.foods[fId];
        foodList.push(new FoodItem(fId, f.name, f.price, f.imgAddr, f.desc));
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
        new FoodItem(data.foods.indexOf(f), f.name, f.price, f.imgAddr, f.desc)
      );
    }

    // this.cart.push(new CartItem(this.cafes[0].foodList[0], 1, this.cafes[0]));
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
}
