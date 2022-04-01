import { loggedWritable } from '../shared/store.util';

export interface Messages {
  message: string;
}

export const messagesStore = loggedWritable<Messages>({
  message: 'hello'
});
