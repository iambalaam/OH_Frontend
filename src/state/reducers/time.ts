import Action from '../actions/action';
import {UPDATE_TIME} from '../actions/time';
import {parseTimeQuery} from '../../utils/time';

const URLSearchParams = require('url-search-params');

export interface TimeState {
    selectedDateTime: Date,
    msPerPixel: number
}
const now = new Date();
export const initialTimeState = {
    selectedDateTime: now,
    msPerPixel: 36000,
};

export const time = (state: TimeState = initialTimeState, action: Action<UPDATE_TIME | undefined>, search = window.location.search): TimeState => {
    switch (action.type) {
        case '@@INIT':
            return parseTimeQuery(new URLSearchParams(search), state);
        case UPDATE_TIME:
            return (<Action<UPDATE_TIME>>action).payload;
        default:
            return state;
    }
}
