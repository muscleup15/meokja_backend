import express from 'express';
import * as authController from '../controller/auth.js';
const route = express.Router();

route.post('/reservation', authController.makeReservation);

route.get('/send', authController.sendKakaoTalk);

export default route;
