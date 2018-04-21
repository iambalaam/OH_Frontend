import Action from '../actions/action';
import {NOTIFY, DISMISS} from '../actions/notif';

export type notificationType = 'INFO' | 'WARN' | 'ERROR';
export interface Message {messageType: notificationType, messageText: string}

export interface notifications {
    queue: Message[]
}
export const initialNotifications: notifications = {queue: []}

// TODO: Investigate ImmutibleJs or similar to avoid future issues
export const notifications = (state: notifications = initialNotifications, action: Action<any>): notifications => {
    let newQueue;
    switch (action.type) {
        case NOTIFY:
            for (let i = 0; i < state.queue.length; i++) {
                if (state.queue[i].messageType === (<Action<NOTIFY>>action).payload.messageType &&
                    state.queue[i].messageText === (<Action<NOTIFY>>action).payload.messageText) {
                    return state;
                }
            }
            newQueue = state.queue.slice()
            newQueue.push((<Action<NOTIFY>>action).payload);
            return Object.assign({}, state, {queue: newQueue})
        case DISMISS:
            newQueue = state.queue.slice()
            newQueue.pop();
            return Object.assign({}, state, {queue: newQueue})
        default:
            return state;
    }
}
