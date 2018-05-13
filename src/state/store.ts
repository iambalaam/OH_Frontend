import {createStore, applyMiddleware, compose, Store} from 'redux';
import {routerMiddleware} from 'react-router-redux';
import {createBrowserHistory} from 'history';
import {reducer} from './reducers/reducer';
import {user, initialUser} from './reducers/user';
import {notifications, initialNotifications} from './reducers/notifications';
import {TimeState, initialTimeState} from './reducers/time';
import {PositionState, initialPositionState} from './reducers/position';
import {Event} from '../api/getEvents';
import Action from './actions/action';

interface store {
    user: user,
    notifications: notifications,
    time: TimeState,
    position: PositionState,
    events: Event[]
}
const initialStore: store = {
    user: initialUser,
    notifications: initialNotifications,
    time: initialTimeState,
    position: initialPositionState,
    events: []
}

const history = createBrowserHistory();
const middleware = routerMiddleware(history);

declare let window: any;
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store: Store<store> = createStore(reducer, initialStore, composeEnhancers(
    applyMiddleware(middleware)
)) as Store<store>;

const dispatch = (action: Action<any>) => {
    store.dispatch(action);
}

export {store, dispatch, history};
