import { CartItem, CartItemInterface } from './cartItem.model';

export interface Order {
  id?: string;
  cart: CartItemInterface[];
  location: { lat: number; lng: number };
  orderedAt?: string;
  status?: string; // 'ongoing' | 'delivered';
}
