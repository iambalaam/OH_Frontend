import {position, initialPositionState, PositionState} from "./position";
import Action from '../actions/action';
import {UPDATE_POSITION, updatePosition} from "../actions/position";

const testInit = {
    type: '@@INIT'
} as Action<UPDATE_POSITION>
export const undefinedAction = {type: 'TEST', payload: undefined}
const testUpdate: Action<UPDATE_POSITION> = {
    type: UPDATE_POSITION,
    payload: {} as PositionState
}

describe('Reducer - position', () => {
    test('Reducer handles undefined state', () => {
        expect(position(undefined, testUpdate)).not.toBeUndefined();
    });
    test('Reducer doesn\'t return undefined', () => {
        expect(position(undefined, undefinedAction)).not.toBeUndefined();
    });
    describe('Can initialise from query params', () => {
        test('Empty search', () => {
            expect(position(undefined, testInit, "")).toEqual(initialPositionState);
        });
        test('Parses latitude, longitude and zoom', () => {
            expect(position(undefined, testInit, "?lat=51.5074&zoom=17&lng=0.1278")) // London
                .toEqual({
                    latitude: 51.5074,
                    longitude: 0.1278,
                    zoom: 17
                });
        });
    });
    describe('Can update position', () => {
        test('Can update latitude and longitude', () => {
            expect(position(initialPositionState, updatePosition({
                latitude: 51.5074,
                longitude: 0.1278
            } as PositionState))).toEqual({
                ...initialPositionState,
                latitude: 51.5074,
                longitude: 0.1278
            });
        });
        test('Cannot not update with only latitude', () => {
            expect(position(initialPositionState, updatePosition({
                latitude: 10
            } as PositionState))).toEqual(initialPositionState);
        });
        test('Can update zoom level', () => {
            expect(position(initialPositionState, updatePosition({
                zoom: 15
            } as PositionState))).toEqual({
                ...initialPositionState,
                zoom: 15
            });
        });
        test('Can update whole PositionState', () => {
            const newState = {
                latitude: 51.5074,
                longitude: 0.1278,
                zoom: 2
            };
            expect(position(initialPositionState, updatePosition(newState))).toEqual(newState);
        });
    });
});
