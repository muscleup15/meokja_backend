import { config } from '../config.js';
import { WebClient, LogLevel } from '@slack/web-api';
import * as DB from './model.js';
const client = new WebClient(config.slackInfo.oauthToken, {
  logLevel: LogLevel.DEBUG,
});

export async function publishMessage(id, text) {
  try {
    await client.chat.postMessage({
      token: config.slackInfo.oauthToken,
      channel: config.slackInfo.channelName,
      blocks: [
        { type: 'divider' },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: text,
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '예약 정보',
            },
            value: 'click_me_123',
            action_id: 'button',
          },
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
}

export async function publishButton(id, text) {
  try {
    await client.chat.postMessage({
      token: config.slackInfo.oauthToken,
      channel: config.slackInfo.channelName,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: ' ',
          },
          accessory: {
            type: 'button',
            text: {
              type: 'plain_text',
              text: '예약 확인',
            },
            value: 'click_me_123',
            action_id: 'button',
          },
        },
        {
          type: 'actions',
          block_id: 'reservation',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '예약 완료',
              },
              style: 'primary',
              value: 'click_me_456',
              url: `https://emunjaezip.com/auth/send${text}&success=true`,
            },
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: '예약 불가능',
              },
              style: 'danger',
              url: `https://emunjaezip.com/auth/send${text}&success=fail`,
            },
          ],
        },
      ],
    });
  } catch (error) {
    console.error(error);
  }
}

export async function createOrder(info) {
  return DB.order.create(info).then((data) => {
    console.log(data);
    return data;
  });
}

export async function findConversation(name) {
  try {
    const result = await client.conversations.list({
      token: config.slackInfo.oauthToken,
    });
    for (const channel of result.channels) {
      if (channel.name === name) {
        const conversationId = channel.id;
        console.log(conversationId);
        return conversationId;
      }
    }
  } catch (error) {
    console.error(error);
  }
}
