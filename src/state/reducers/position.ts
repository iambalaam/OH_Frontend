import Action from '../actions/action';
import {UPDATE_POSITION} from '../actions/position';
import {parsePositionQuery} from '../../utils/position';

const URLSearchParams = require('url-search-params');

export interface PositionState {
    latitude: number,
    longitude: number,
    zoom: number
}
export const initialPositionState: PositionState = {
    latitude: 53.3862166,
    longitude: -1.4582634,
    zoom: 10
}

const handleUpdatePosition = (state: PositionState, action: Action<UPDATE_POSITION>) => {
    const newPosition: PositionState = {
        latitude: state.latitude,
        longitude: state.longitude,
        zoom: state.zoom,
    };
    if (action.payload.latitude && action.payload.longitude) {
        newPosition.latitude = action.payload.latitude;
        newPosition.longitude = action.payload.longitude;
    }
    if (action.payload.zoom) {
        newPosition.zoom = action.payload.zoom
    };
    return newPosition;
}

// ???: Is there a better way of doing this window.location.search mocking with Jest?
export const position = (state: PositionState = initialPositionState, action: Action<any>, search = window.location.search): PositionState => {
    switch (action.type) {
        case UPDATE_POSITION:
            return handleUpdatePosition(state, action);
        case '@@INIT':
            return parsePositionQuery(new URLSearchParams(search), state);
        default:
            return state;
    }
};
