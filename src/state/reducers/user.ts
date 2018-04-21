import Action from '../actions/action';
import {SIGN_IN, SIGN_OUT} from '../actions/user';

export interface user {
    isSignedIn: boolean
};
export const initialUser: user = {isSignedIn: false};

export const user = (state: user = initialUser, action: Action<any>): user => {
    const newState = Object.assign({}, state);
    switch (action.type) {
        case SIGN_IN:
            newState.isSignedIn = true;
            return newState;
        case SIGN_OUT:
            newState.isSignedIn = false;
            return newState;
        default:
            return state;
    }
}
