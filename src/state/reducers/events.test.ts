import {events} from './events';
import Action from '../actions/action';
import {UPDATE_EVENTS} from '../actions/events';

const testEvents: UPDATE_EVENTS = [
    {
        description: 'test description',
        text: 'mock text',
        id: '0',
        lat: 0,
        lng: 0,
        start: new Date(),
        finish: new Date()
    }
]
const testAction: Action<UPDATE_EVENTS> = {
    type: UPDATE_EVENTS,
    payload: testEvents
}

describe('Reducer - events', () => {
    test('Reducer has initial state', () => {
        expect(events(undefined, testAction)).not.toBeUndefined();
    });
    test('Has a default action', () => {
        expect(events(undefined, {type: '@@INIT', payload: undefined})).not.toBeUndefined();
    });
    test('Can add events', () => {
        const newEvents = events(undefined, testAction);
        expect(newEvents.length).toBeGreaterThanOrEqual(1);
        expect(newEvents.filter((event => event.id === testEvents[0].id))).toEqual(testEvents);
    });
    test('Can remove events', () => {
        expect(events(testEvents, {type: UPDATE_EVENTS, payload: []})).toEqual([]);
    })
});
