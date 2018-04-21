import Action from './action';
import {notificationType, Message} from '../reducers/notifications';

// Notification types, actions and creators
export const NOTIFY = 'NOTIFY';
export type NOTIFY = Message
export const DISMISS = 'DISMISS';
export type DISMISS = void;
export const notify = (type: notificationType, text: string): Action<NOTIFY> => ({
    type: NOTIFY,
    payload: {messageType: type, messageText: text}
})
export const dismiss = (): Action<DISMISS> => ({
    type: DISMISS,
    payload: undefined
})
