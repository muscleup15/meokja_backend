import { config } from '../config.js';
import request from 'request';
import * as authRepository from '../data/auth.js';
import { getOnlyResName } from '../data/info.js';

export async function makeReservation(req, res, next) {
  const { Phone_number, Book_date, People, Restaurant_id } = req.body;
  const resName = await getOnlyResName(Restaurant_id);
  const bookdate = Book_date.replace(' ', '');
  let Booker = req.body.Booker;
  await authRepository.publishMessage(
    config.slackInfo.channelId,
    `예약자명: ${Booker}\n인원수: ${People}\n핸드폰번호: ${Phone_number}\n예약날짜: ${Book_date}\n레스토랑명: ${resName.dataValues.Name}\n전화번호: ${resName.dataValues.Tel}`
  );
  Booker = encodeURI(req.body.Booker);
  await authRepository.publishButton(
    config.slackInfo.channelId,
    `?booker=${Booker}&people=${People}&phonenum=${Phone_number}&bookdate=${bookdate}&resid=${Restaurant_id}`
  );
  await authRepository.createOrder({
    Phone_number,
    Booker,
    People,
    Book_date,
    Restaurant_id,
  });
  return res.status(200).json({ message: '예약완료' });
}

export async function sendKakaoTalk(req, res, next) {
  const { booker, people, phonenum, resid, success } = req.query;
  let bookdate = req.query.bookdate;
  let datearr = Array.from(bookdate);
  datearr.splice(10, 0, ' ');
  bookdate = datearr.join('');
  console.log(bookdate);
  const resName = await getOnlyResName(resid);
  if (success == 'true') {
    request.post({
      url: 'https://alimtalk-api.bizmsg.kr/v2/sender/send/',
      method: 'POST',
      headers: { userId: config.kakaoInfo.id },
      body: [
        {
          message_type: 'at',
          phn: phonenum,
          profile: config.kakaoInfo.key,
          msg: successTemplate(
            booker,
            people,
            phonenum,
            bookdate,
            resName.dataValues.Name
          ),
          tmplId: 'ok',
        },
      ],
      json: true,
    });
  }
  if (success == 'fail') {
    request.post({
      url: 'https://alimtalk-api.bizmsg.kr/v2/sender/send/',
      method: 'POST',
      headers: { userId: config.kakaoInfo.id },
      body: [
        {
          message_type: 'at',
          phn: phonenum,
          profile: config.kakaoInfo.key,
          msg: failTemplate(booker, resName.dataValues.Name),
          tmplId: 'fail',
        },
      ],
      json: true,
    });
  }
  res.status(200).json('hi');
}

function successTemplate(booker, people, phonenum, bookdate, name) {
  return `안녕하세요. 먹자 서비스를 사용해주셔서 감사합니다.
${booker}님 ${name} 지점 예약이 성공되었습니다.
    
예약자 성함: ${booker}
예약자 번호: ${phonenum}
점포명: ${name}
시간: ${bookdate}
인원수: ${people}
    
꼭 예약 시간에 방문해 주세요.
    
*미방문시 노쇼 패널티가 부과됩니다.
*예약시간 미방문 및 예약 변경 취소는 오픈카카오채널을 통해 문의해주세요`;
}
function failTemplate(booker, name) {
  return `안녕하세요. 먹자 서비스를 사용해주셔서 감사합니다.

아쉽게도 음식점 사정 및 예약 관리 시스템에 의해,
${booker}님 ${name} 지점 예약이 취소되었습니다.

다른 음식점 예약은 먹자 사이트를 통해 부탁드립니다.

*예약시간 미방문 및 예약 변경 취소는 오픈카카오채널을 통해 문의해주세요`;
}
