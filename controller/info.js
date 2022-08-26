import * as infoRepository from '../data/info.js';

export async function getSearchedRestaurant(req, res, error) {
  let { category, keyword, X, Y } = req.query;
  const page = Number(req.query.page || 1) - 1;
  const limit = Number(req.query.limit || 20);
  if (category.length === 0 && keyword.length === 0) {
    let ret = await infoRepository.getAll();
    ret = ret.map((e) => e.dataValues);
    ret = await infoRepository.categorySort(ret, X, Y);
    let pagedRes = [];
    for (let i = page * limit; i < page * limit + 20; i++) {
      if (ret[i] ?? null) {
        pagedRes.push(ret[i]);
      }
    }
    res.status(200).json(pagedRes);
  }

  if (req.query.keyword.length === 0) {
    keyword = '';
  } else {
    keyword = req.query.keyword.trim().split(' ');
  }

  if (category.length === 0 && keyword.length !== 0) {
    let keywordList;
    for (let i = 0; i < keyword.length; i++) {
      keywordList = await infoRepository.getByKeyWord(keyword[i]);
    }
    if (keywordList.length !== 0) {
      const filteredList = keywordList.filter((element) => {
        return element.length !== 0;
      });

      let ret = await infoRepository.categorySort(filteredList, X, Y);
      let pagedRes = [];
      for (let i = page * limit; i < page * limit + 20; i++) {
        if (ret[i] ?? null) {
          pagedRes.push(ret[i]);
        }
      }
      res.status(200).json(pagedRes);
    } else {
      res.status(200).json([]);
    }
  }

  if (category.length !== 0 && keyword.length === 0) {
    const categoryList = await infoRepository.getByCategory(category);
    const filteredRet = await infoRepository.categorySort(categoryList, X, Y);
    let pagedRes = [];
    for (let i = page * limit; i < page * limit + 20; i++) {
      if (filteredRet[i] ?? null) {
        pagedRes.push(filteredRet[i]);
      }
    }
    res.status(200).json(pagedRes);
  }

  if (category.length !== 0 && keyword.length !== 0) {
    const categoryList = await infoRepository.getByCategory(category);
    let keywordList;
    for (let i = 0; i < keyword.length; i++) {
      keywordList = await infoRepository.getByKeyWord(keyword[i]);
    }
    if (keywordList.length !== 0) {
      const filteredList = keywordList.filter((element) => {
        return element.length !== 0;
      });
      let ret = categoryList.filter((element) => {
        return filteredList.some((item) => {
          return item['Restaurants.id'] == element['Restaurants.id'];
        });
      });
      ret = await infoRepository.categorySort(ret, X, Y);
      let pagedRes = [];
      for (let i = page * limit; i < page * limit + 20; i++) {
        if (ret[i] ?? null) {
          pagedRes.push(ret[i]);
        }
      }
      res.status(200).json(pagedRes);
    } else {
      res.status(200).json([]);
    }
  }
}

export async function getResDetail(req, res, next) {
  const { id } = req.params;
  const ret = await infoRepository.getById(id);
  console.log(ret);
  res.status(200).json(ret);
}
