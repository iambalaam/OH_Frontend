import {user} from './user';
import {signIn, signOut} from '../actions/user';

const testAction = {type: 'TEST', payload: undefined};
const userStates: Array<user | undefined> = [
    undefined,
    {isSignedIn: true},
    {isSignedIn: false}
]

describe('Reducer - user', () => {
    test('Reducer has initial state', () => {
        expect(user(undefined, testAction)).not.toBeUndefined();
    });
    userStates.forEach((state) => {
        test(`User can sign in - ${state ? JSON.stringify(state) : 'undefined'}`, () => {
            expect(user(state, signIn())).toEqual({
                isSignedIn: true
            });
        });
    });
    userStates.forEach((state) => {
        test(`User can sign out - ${state ? JSON.stringify(state) : 'undefined'}`, () => {
            expect(user(state, signOut())).toEqual({
                isSignedIn: false
            });
        });
    });
});
