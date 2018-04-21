import {notifications} from './notifications';
import {notify, dismiss} from '../actions/notif';
import {Message} from '../../ui/Notifications/Notification'


const testInfo = notify('INFO', '');
const testQueue: Array<Message> = [
    {messageType: 'INFO', messageText: 'Message 1'},
    {messageType: 'WARN', messageText: 'Message 2'},
    {messageType: 'ERROR', messageText: 'Message 3'}
]

describe('Reducer - notifications', () => {
    test('Reducer has initial state', () => {
        expect(notifications(undefined, testInfo)).not.toBeUndefined();
    });
    test('Can add notification', () => {
        const text = 'some phrase';
        expect(
            notifications({queue: testQueue}, notify('INFO', text))
        ).toEqual({queue: testQueue.concat({messageType: 'INFO', messageText: text})});
    });
    test('Can dismiss notifications', () => {
        expect(
            notifications({queue: testQueue}, dismiss())
        ).toEqual({queue: testQueue.slice(0, 2)});
    });
    test('Has a default action', () => {
        expect(
            notifications({queue: testQueue}, {type: '@@INIT', payload: undefined})
        ).toEqual({queue: testQueue});
    })
    test('Does not add the same notification multiple times', () => {
        expect(
            notifications({queue: testQueue}, notify('INFO', 'Message 1'))
        ).toEqual({queue: testQueue});
    })
});
