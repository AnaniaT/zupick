import { CafeInterface } from './cafe.model';

export interface FoodItemInterface {
  id: string;
  name: string;
  price?: number;
  imgAddr?: string;
  desc?: string;
  category?: string;
  availableAt?: CafeInterface[];
}

export class FoodItem {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public imgAddr: string,
    public desc: string,
    public category: number
  ) {
    // this.id = new Date().toISOString();
  }
}
