import { CartItem } from './cartItem.model';

export interface Order {
  cart: CartItem[];
  location: { lat: number; lng: number };
}
