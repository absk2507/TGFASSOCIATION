import { TRPCError } from '@trpc/server';
import { ENV } from './env';

const TITLE_MAX_LENGTH = 1200;
const CONTENT_MAX_LENGTH = 20000;

export interface NotificationPayload {
  title: string;
  content: string;
}

export async function notifyOwner(payload: NotificationPayload): Promise<boolean> {
  const title = payload.title?.trim() || '';
  const content = payload.content?.trim() || '';

  if (!title || !content) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Notification title and content are required.',
    });
  }

  if (title.length > TITLE_MAX_LENGTH || content.length > CONTENT_MAX_LENGTH) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Notification payload exceeds maximum allowed size.',
    });
  }

  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.info(`[Notification Mock] ${title}: ${content}`);
    return true;
  }

  const endpoint = new URL(
    'webdevtoken.v1.WebDevService/SendNotification',
    ENV.forgeApiUrl.endsWith('/') ? ENV.forgeApiUrl : `${ENV.forgeApiUrl}/`
  ).toString();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        authorization: `Bearer ${ENV.forgeApiKey}`,
        'content-type': 'application/json',
        'connect-protocol-version': '1',
      },
      body: JSON.stringify({ title, content }),
    });

    if (!response.ok) {
      console.warn(`[Notification] Failed (${response.status})`);
      return false;
    }
    return true;
  } catch (error) {
    console.warn('[Notification] Error calling notification service:', error);
    return false;
  }
}
