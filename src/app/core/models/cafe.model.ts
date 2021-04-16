import { FoodItem } from './item.model';

interface CafeInterface {
  name: string;
  id: number;
  foodList: FoodItem[];
  logo?: string;
  location?: Coord;
}
interface Coord {
  lat: number;
  lng: number;
}

export class Cafe {
  public id: number;
  public name: string;
  public logo: string;
  public location: Coord;
  public foodList: FoodItem[];

  constructor({ id, name, logo, location, foodList }: CafeInterface) {
    this.id = id;
    this.foodList = foodList;
    this.name = name;
    this.location = location || null;
    this.logo = logo || '/assets/B1.jpg';
  }
}
