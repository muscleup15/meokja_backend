import * as testRepository from '../data/test.js';

export async function category(req, res, next) {
  const { Img, Name } = req.body;
  const category = await testRepository.createCategory({
    Img,
    Name,
  });
  res.status(201).json({ message: 'category' });
}
export async function order(req, res, next) {
  const { Phone_number, Booker, People, Book_date, RestaurantId } = req.body;
  const date = new Date(Book_date * 1000);
  const order = await testRepository.createOrder({
    Phone_number,
    Booker,
    People,
    Book_date: date,
    RestaurantId,
  });
  res.status(201).json({ message: 'order' });
}
export async function restaurant(req, res, next) {
  const { id, Name, X, Y, Tel, Address, Times, CategoryId, menu } = req.body;
  await testRepository.createRestaurant({
    id,
    Name,
    X,
    Y,
    Tel,
    Address,
    Times,
    CategoryId,
  });
  for (let i = 0; i < menu.length; i++) {
    await testRepository.createMenu({
      Name: menu[i]['name'],
      Price: menu[i]['price'],
      RestaurantId: id,
    });
  }

  res.status(201).json({ message: 'restaurant' });
}
export async function menu(req, res, next) {
  const { Name, Price, RestaurantId } = req.body;
  const userId = await testRepository.createMenu({
    Name,
    Price,
    RestaurantId,
  });
  res.status(201).json({ message: 'menu' });
}

export async function newRestaurant(req, res, next) {
  const { id, menu } = req.body;
  await testRepository.updateRestaurant(id, menu);
  res.status(201).json({ message: 'updated' });
}
