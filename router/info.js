import express from 'express';
import * as infoController from '../controller/info.js';
const route = express.Router();

route.get('/search', infoController.getSearchedRestaurant);

route.get('/restaurant/:id', infoController.getResDetail);

export default route;
