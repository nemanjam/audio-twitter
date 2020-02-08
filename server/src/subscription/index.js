import { PubSub } from 'apollo-server';

import * as MESSAGE_EVENTS from './message';
import * as NOTIFICATION_EVENTS from './notification';

export const EVENTS = {
  MESSAGE: MESSAGE_EVENTS,
  NOTIFICATION: NOTIFICATION_EVENTS,
};

export default new PubSub();
