import express from 'express';
import request from 'request';
import * as testController from '../controller/test.js';
const route = express.Router();

route.post('/category', testController.category);
route.post('/order', testController.order);
route.post('/restaurant', testController.restaurant);
route.post('/menu', testController.menu);
route.post('/newrestaurant', testController.newRestaurant);

//여기서 정보를 받아서 kakaotalk으로 보내줘야 함
route.get('/', (req, res, next) => {
  const { booker, people, phonenum, bookdate, resid, success } = req.query;
  console.log(req.query);
  console.log(success);
  console.log(typeof success);
  if (success == 'true') {
    request.post(
      {
        url: 'https://alimtalk-api.bizmsg.kr/v2/sender/send/',
        method: 'POST',
        headers: { userId: 'skyon2020' },
        body: [
          {
            message_type: 'at',
            phn: '01066389228',
            profile: 'ecf24322b6579c4b6734d4fc4f09849f587e1ebf',
            msg: `안녕하세요. 먹자 서비스를 사용해주셔서 감사합니다.
${booker}님 #{점포명} 지점 예약이 성공되었습니다.

예약자 성함: #{이름}
예약자 번호: #{전화번호}
점포명: #{점포명}
시간: #{예약시간}
인원수: #{인원수}

꼭 예약 시간에 방문해 주세요.

*미방문시 노쇼 패널티가 부과됩니다.
*예약시간 미방문 및 예약 변경 취소는 오픈카카오채널을 통해 문의해주세요`,
            tmplId: 'ok',
          },
        ],
        json: true,
      },
      function (error, response, body) {}
    );
  }
  if (success == 'fail') {
    request.post(
      {
        url: 'https://alimtalk-api.bizmsg.kr/v2/sender/send/',
        method: 'POST',
        headers: { userId: 'skyon2020' },
        body: [
          {
            message_type: 'at',
            phn: '01066389228',
            profile: 'ecf24322b6579c4b6734d4fc4f09849f587e1ebf',
            msg: `안녕하세요. 먹자 서비스를 사용해주셔서 감사합니다.

아쉽게도 음식점 사정 및 예약 관리 시스템에 의해,
#{이름}님 #{점포명} 지점 예약이 취소되었습니다.

다른 음식점 예약은 먹자 사이트를 통해 부탁드립니다.

*예약시간 미방문 및 예약 변경 취소는 오픈카카오채널을 통해 문의해주세요`,
            tmplId: 'fail',
          },
        ],
        json: true,
      },
      function (error, response, body) {}
    );
  }
  res.status(200).json('hi');
});

export default route;
