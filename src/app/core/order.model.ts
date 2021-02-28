export interface Coordinates {
  lat: number;
  lng: number;
}

export interface OrderInterface {
  desc: string;
  pickupPlace: {
    name: string;
    location: Coordinates;
  };
  dropPlace: {
    name: string;
    location: Coordinates;
  };
}

// export class Order {
//   desc: string;
//   pickupPlace: {
//     name: string;
//     location: Coordinates;
//   };
//   dropPlace: {
//     name: string;
//     location: Coordinates;
//   };

//   constructor(orderObj: OrderInterface) {
//     for (let key in orderObj) {
//       if (orderObj.hasOwnProperty(key)) {
//         this[key] = orderObj[key];
//       }
//     }
//   }
// }

export class Order {
  constructor(
    public pickupPlace: {
      name: string;
      location: Coordinates;
    },
    public dropPlace: {
      name: string;
      location: Coordinates;
    },
    public desc: string
  ) {}
}
