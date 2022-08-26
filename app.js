import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import { config } from './config.js';
import { sequelize } from './data/model.js';
import responseTime from 'response-time';
import testRouter from './router/test.js';
import infoRouter from './router/info.js';
import authRouter from './router/auth.js';
const app = express();
app.use(express.json());

app.use(
  cors()
  //origin 해당하는 도메인에서만 사용할 수 있게 넣어주는거라는데
  //credentials: true : header에 사용자 정보를 넣을 수 있게
);

app.use(
  responseTime((req, res, time) => {
    console.log(`----------------------------------------`);
    console.log(`new request: ${req.originalUrl}`);
    console.log(`${req.method} ${req.url} ${time}ms`);
    console.log(`headers: ${JSON.stringify(req.headers)}`);
    console.log(`body: ${JSON.stringify(req.body)}`);
    console.log(`query: ${JSON.stringify(req.query)}`);
    console.log(`params: ${JSON.stringify(req.params)}`);
    console.log(`----------------------------------------`);
  })
);
app.use('/test', testRouter);
app.use('/info', infoRouter);
app.use('/auth', authRouter);

app.use((req, res, next) => {
  return res.status(404).send('Not Found');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.sendStatus(500);
});
sequelize.sync().then(
  app.listen(config.host.port, () => {
    console.log(`Example app listening on port ${config.host.port}`);
  })
);
