import Action from './action';
import {PositionState} from '../reducers/position'

export const UPDATE_POSITION = 'UPDATE_POSITION';
export type UPDATE_POSITION = PositionState;
export const updatePosition = (position: PositionState): Action<UPDATE_POSITION> => ({type: UPDATE_POSITION, payload: position});
