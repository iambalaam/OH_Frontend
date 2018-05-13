import Action from '../actions/action';
import {UPDATE_EVENTS} from '../actions/events';

export const events = (state: UPDATE_EVENTS = [], action: Action<any>): UPDATE_EVENTS => {
    switch (action.type) {
        case UPDATE_EVENTS:
            return action.payload;
        default:
            return state;
    }
}
