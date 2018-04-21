import Action from './action'

export const SIGN_IN = 'SIGN_IN';
export type SIGN_IN = void;
export const SIGN_OUT = 'SIGN_OUT';
export type SIGN_OUT = void;
export const signIn = (): Action<SIGN_IN> => ({type: SIGN_IN, payload: undefined})
export const signOut = (): Action<SIGN_OUT> => ({type: SIGN_OUT, payload: undefined})