import { FoodItem, FoodItemInterface } from './item.model';
import { Cafe, CafeInterface } from './cafe.model';

export class CartItem {
  constructor(
    public food: FoodItem,
    public quantity: number,
    public cafe: Cafe
  ) {}
}

export interface CartItemInterface {
  food: FoodItemInterface;
  quantity: number;
  cafe: CafeInterface;
}
