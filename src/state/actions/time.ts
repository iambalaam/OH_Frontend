import Action from './action';
import {TimeState} from '../reducers/time';

export const UPDATE_TIME = 'UPDATE_TIME';
export type UPDATE_TIME = TimeState;
export const updateTime = (time: TimeState): Action<UPDATE_TIME> => ({type: UPDATE_TIME, payload: time});
