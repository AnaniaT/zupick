import { FoodItem } from './item.model';
import { Cafe } from './cafe.model';

export class CartItem {
  constructor(
    public food: FoodItem,
    public quantity: number,
    public cafe: Cafe
  ) {}
}
