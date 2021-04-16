interface FoodItemInterface {
  imgAddr: string;
  name: string;
  price: number;
  desc: string;
}

export class FoodItem {
  constructor(
    public id: number,
    public name: string,
    public price: number,
    public imgAddr: string,
    public desc: string
  ) {
    // this.id = new Date().toISOString();
  }
}
