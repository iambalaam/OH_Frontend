import {time, initialTimeState} from "./time";
import Action from "../actions/action";
import {UPDATE_TIME, updateTime} from "../actions/time";
import {undefinedAction} from "./position.test";
import {SELECTION_WIDTH, MONTH} from "../../utils/time";

const testInit = {
    type: '@@INIT'
} as Action<UPDATE_TIME>;
const testTimeState = {
    selectedDateTime: new Date(1994, 9, 12, 7, 30),
    msPerPixel: MONTH / SELECTION_WIDTH
}
const testAction: Action<UPDATE_TIME> = updateTime(testTimeState);

describe('Reducer - time', () => {
    test('Reducer handles undefined state', () => {
        expect(time(undefined, testAction)).not.toBeUndefined();
    });
    test('Reducer doesn\'t return undefined', () => {
        expect(time(testTimeState, undefinedAction)).not.toBeUndefined();
    });
    describe('Can initialise from query params', () => {
        test('Empty search', () => {
            expect(time(undefined, testInit, '')).toEqual(initialTimeState);
        });
        test('Can parse new time', () => {
            expect(
                time(undefined, testInit, `?time=${testTimeState.selectedDateTime.toISOString()}&range=${MONTH}`)
            ).toEqual(testTimeState)
        })
    });
});
