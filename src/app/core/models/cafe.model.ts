import { FoodItem } from './item.model';

interface Coord {
  lat: number;
  lng: number;
}

export interface CafeInterface {
  id: string;
  name: string;
  logo?: string;
  location?: Coord;
  foodList?: string[];
}


export class Cafe {
  public id: string;
  public name: string;
  public logo: string;
  public location: Coord;
  public foodList: string[];

  constructor({ id, name, logo, location, foodList }: CafeInterface) {
    this.id = id;
    this.foodList = foodList;
    this.name = name;
    this.location = location || null;
    this.logo = logo || '/assets/B1.jpg';
  }
}
