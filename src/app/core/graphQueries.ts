import { gql } from 'apollo-angular';

const ADD_ORDER_MUTATION = gql`
  mutation($cart: [CartItemInput]!, $location: CoordinateInput!) {
    addOrder(cart: $cart, location: $location) {
      id
      cart {
        food {
          name
          price
          imgAddr
        }
        cafe {
          name
        }
        quantity
      }
      location {
        lat
        lng
      }
      orderedAt
      status
    }
  }
`;

const GET_ORDERS = gql`
  {
    orders {
      id
      cart {
        food {
          name
          price
          imgAddr
        }
        cafe {
          name
        }
        quantity
      }
      location {
        lat
        lng
      }
      orderedAt
      status
    }
  }
`;

const GET_CATEGORIES = gql`
  {
    categories {
      id
      name
    }
  }
`;

const GET_FOOD = gql`
  query($id: String!) {
    food(id: $id) {
      id
      name
      desc
      price
      imgAddr
      category
      availableAt {
        id
        name
        logo
      }
    }
  }
`;

const SEARCH_FOOD = gql`
  query($searchTerm: String!) {
    foods(name: $searchTerm) {
      id
      name
      imgAddr
      price
    }
  }
`;

const FILTER_FOOD_BY_CATEGORY = gql`
  query($categoryId: String!) {
    foods(category: $categoryId) {
      id
      name
      imgAddr
      price
    }
  }
`;

export {
  ADD_ORDER_MUTATION,
  GET_ORDERS,
  GET_CATEGORIES,
  GET_FOOD,
  SEARCH_FOOD,
  FILTER_FOOD_BY_CATEGORY,
};
