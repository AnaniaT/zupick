const desc = `Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nobis eos quas
earum impedit ea possimus officiis, est fugit rerum dolores. Handle the
overflow of text here.`;

export let data = {
  categories: ['Burgers', 'Pizza', 'Chicken', 'Sandwichs'],
  foods: [
    {
      // 0
      name: 'Beef Burger',
      price: 140,
      imgAddr: '/assets/B1.jpg',
      desc,
      category: 0,
    },
    {
      // 1
      name: 'Chicken Burger',
      price: 190,
      imgAddr: '/assets/B1.jpg',
      desc,
      category: 0,
    },
    {
      // 2
      name: 'Cheese Burger',
      price: 170,
      imgAddr: '/assets/B1.jpg',
      desc,
      category: 0,
    }, // 3
    {
      name: 'Salmon Burger',
      price: 150,
      imgAddr: '/assets/B1.jpg',
      desc,
      category: 0,
    },
    {
      // 4
      name: 'Pizza Margherita',
      price: 150,
      imgAddr: '/assets/P1.jpg',
      desc,
      category: 1,
    },
    {
      // 5
      name: 'Pepperoni Pizza',
      price: 180,
      imgAddr: '/assets/P1.jpg',
      desc,
      category: 1,
    },
    {
      // 6
      name: 'Chocolate Pizza',
      price: 210,
      imgAddr: '/assets/P1.jpg',
      desc,
      category: 1,
    },
    {
      // 7
      name: 'Neapolitan Pizza',
      price: 190,
      imgAddr: '/assets/P1.jpg',
      desc,
      category: 1,
    },
    {
      // 8
      name: 'Chicken Fry',
      price: 140,
      imgAddr: '/assets/C1.jpg',
      desc,
      category: 2,
    },
    {
      // 9
      name: 'Crunchy Chicken',
      price: 160,
      imgAddr: '/assets/C1.jpg',
      desc,
      category: 2,
    },
    {
      // 10
      name: 'Chicken Hut',
      price: 150,
      imgAddr: '/assets/C1.jpg',
      desc,
      category: 2,
    },
    {
      // 11
      name: 'Chicken With Dip',
      price: 180,
      imgAddr: '/assets/C1.jpg',
      desc,
      category: 2,
    },
    {
      // 12
      name: 'Clubhouse Sandwich',
      price: 150,
      imgAddr: '/assets/S1.jpg',
      desc,
      category: 3,
    },
    {
      // 13
      name: 'Crunchy Sandwich',
      price: 170,
      imgAddr: '/assets/S1.jpg',
      desc,
      category: 3,
    },
    {
      // 14
      name: 'Baked Sandwich',
      price: 160,
      imgAddr: '/assets/S1.jpg',
      desc,
      category: 3,
    },
    {
      // 15
      name: 'Vegitable Sandwich',
      price: 140,
      imgAddr: '/assets/S1.jpg',
      desc,
      category: 3,
    },
  ],
  cafes: [
    {
      name: 'Tinbit Juice',
      foodList: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14],
    },
    {
      name: 'Rome 1990 Piazza',
      foodList: [1, 2, 3, 5, 6, 7, 9, 10, 11, 13, 14, 15],
    },
    {
      name: 'Tasso Italian',
      foodList: [0, 2, 3, 4, 6, 7, 10, 11, 8, 14, 15, 12],
    },
    {
      name: 'Time Cafe',
      foodList: [0, 1, 3, 4, 5, 7, 11, 8, 9, 15, 12, 13],
    },
    {
      name: 'Hani Pizza',
      foodList: [0, 1, 2, 4, 5, 6, 8, 9, 10, 12, 13, 14],
    },
  ],
};
