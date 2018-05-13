import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {user} from './user';
import {notifications} from './notifications';
import {time} from './time';
import {position} from './position'
import {events} from './events';

export const reducer = combineReducers({
    user,
    notifications,
    time,
    position,
    events,
    routing: routerReducer
});
