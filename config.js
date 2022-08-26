import dotenv from 'dotenv';
dotenv.config();

function required(key, defaultValue = undefined) {
  const value = process.env[key] || defaultValue;
  if (value == null) {
    throw new Error(`Key ${key} is undefined`);
  }
  return value;
}
export const config = {
  db: {
    host: required('DB_HOST'),
    user: required('DB_USER'),
    database: required('DB_DATABASE'),
    password: required('DB_PASSWORD'),
  },
  host: {
    port: parseInt(required('HOST_PORT', 3000)),
  },
  slackInfo: {
    oauthToken: required('OAUTH_TOKEN'),
    channelName: required('CHANNEL_NAME'),
    channelId: required('CHANNEL_ID'),
  },
  kakaoInfo: {
    id: required('KAKAO_ID'),
    key: required('KAKAO_KEY'),
  },
};
