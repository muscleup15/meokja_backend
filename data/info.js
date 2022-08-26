import SQ from 'sequelize';
import * as DB from './model.js';
const Op = SQ.Op;
const Sequelize = SQ.Sequelize;
export async function findRestaurant() {}

export async function getByCategory(category) {
  return await DB.category.findAll({
    where: { Name: category },
    include: [
      {
        model: DB.restaurant,
        where: { Tel: { [Op.not]: 'nan' } },
        attributes: [
          'id',
          'Name',
          'X',
          'Y',
          'Tel',
          'Address',
          'Times',
          'CategoryId',
        ],
      },
    ],
    raw: true,
    subQuery: false,
    attributes: ['id'],
  });
}

export async function getByKeyWord(keyword) {
  let ret = [];
  let retres = await DB.restaurant.findAll({
    where: {
      Name: {
        [Op.like]: `%${keyword}%`,
      },
      Tel: { [Op.not]: 'nan' },
    },
    attributes: [
      ['id', 'Restaurants.id'],
      ['Name', 'Restaurants.Name'],
      ['X', 'Restaurants.X'],
      ['Y', 'Restaurants.Y'],
      ['Tel', 'Restaurants.Tel'],
      ['Address', 'Restaurants.Address'],
      ['Times', 'Restaurants.Times'],
      ['CategoryId', 'Restaurants.CategoryId'],
    ],
  });
  retres = retres.map((e) => e.dataValues);
  if (retres.length !== 0) {
    ret.push(retres);
  }
  let retmenu = await DB.menu.findAll({
    where: {
      Name: {
        [Op.like]: `%${keyword}%`,
      },
    },
    include: [
      {
        model: DB.restaurant,
        attributes: [],
      },
    ],
    attributes: [
      [Sequelize.col('Restaurant.id'), 'id'],
      [Sequelize.col('Restaurant.Name'), 'Name'],
      [Sequelize.col('Restaurant.X'), 'X'],
      [Sequelize.col('Restaurant.Y'), 'Y'],
      [Sequelize.col('Restaurant.Tel'), 'Tel'],
      [Sequelize.col('Restaurant.Address'), 'Address'],
      [Sequelize.col('Restaurant.Times'), 'Times'],
      [Sequelize.col('Restaurant.CategoryId'), 'CategoryId'],
    ],
  });
  retmenu = retmenu.map((e) => e.dataValues);
  retmenu = retmenu.map((e) => {
    return {
      'Restaurants.id': e.id,
      'Restaurants.Name': e.Name,
      'Restaurants.X': e.X,
      'Restaurants.Y': e.Y,
      'Restaurants.Tel': e.Tel,
      'Restaurants.Address': e.Address,
      'Restaurants.Times': e.Times,
      'Restaurants.CategoryId': e.CategoryId,
    };
  });
  if (retmenu.length !== 0) {
    ret.push(retmenu);
  }
  return ret.reduce((a, b) => [...a, ...b], []);
}

export async function keywordSort(array, X, Y) {
  return array.sort(function (a, b) {
    return (
      Math.pow(a.X - X, 2) +
      Math.pow(a.Y - Y, 2) -
      (Math.pow(b.X - X, 2) + Math.pow(b.Y - Y, 2))
    );
  });
}

export async function categorySort(array, X, Y) {
  return array.sort(function (a, b) {
    return (
      Math.pow(a['Restaurants.X'] - X, 2) +
      Math.pow(a['Restaurants.Y'] - Y, 2) -
      (Math.pow(b['Restaurants.X'] - X, 2) +
        Math.pow(b['Restaurants.Y'] - Y, 2))
    );
  });
}

export async function getById(id) {
  return DB.restaurant.findByPk(id, {
    include: {
      model: DB.menu,
    },
  });
}
export async function getOnlyResName(id) {
  return DB.restaurant.findByPk(id, {
    attributes: ['Name', 'Tel'],
  });
}

export async function getAll() {
  return DB.restaurant.findAll({
    attributes: [
      ['id', 'Restaurants.id'],
      ['Name', 'Restaurants.Name'],
      ['X', 'Restaurants.X'],
      ['Y', 'Restaurants.Y'],
      ['Tel', 'Restaurants.Tel'],
      ['Address', 'Restaurants.Address'],
      ['Times', 'Restaurants.Times'],
      ['CategoryId', 'Restaurants.CategoryId'],
    ],
  });
}
