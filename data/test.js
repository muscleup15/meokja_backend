import * as DB from './model.js';

export async function createCategory(cat) {
  return DB.category.create(cat).then((data) => {
    console.log(data);
    return data;
  });
}
export async function createOrder(ord) {
  return DB.order.create(ord).then((data) => {
    console.log(data);
    return data;
  });
}
export async function createRestaurant(res) {
  return DB.restaurant.create(res).then((data) => {
    console.log(data);
    return data;
  });
}

export async function updateRestaurant(id, menu) {
  return DB.restaurant.findByPk(id).then((restaurant) => {
    restaurant.menu = menu;
    restaurant.save;
  });
}

export async function createMenu(menu) {
  return DB.menu.create(menu).then((data) => {
    console.log(data);
    return data;
  });
}
