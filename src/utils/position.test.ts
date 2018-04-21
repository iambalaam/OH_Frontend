import {parsePositionQuery} from "./position";
import {initialPositionState} from "../state/reducers/position";

const URLSearchParams = require('url-search-params');

describe('parsePositionQuery()', () => {
    test('Test empty query', () => {
        expect(parsePositionQuery(new URLSearchParams(), initialPositionState)).toEqual(initialPositionState);
    });
    test('Can parse latitude and longitude', () => {
        expect(parsePositionQuery(
            new URLSearchParams('?lat=51.5074&lng=0.1278')
        )).toEqual({
            latitude: 51.5074,
            longitude: 0.1278,
        });
    });
    test('Will not parse latitude only', () => {
        expect(parsePositionQuery(
            new URLSearchParams('?lat=51.5074')
        )).toEqual({});
    });
    test('Can parse zoom', () => {
        expect(parsePositionQuery(
            new URLSearchParams('?zoom=6')
        )).toEqual({
            zoom: 6
        });
    });
    test('Can parse latitude, longitude and zoom', () => {
        expect(parsePositionQuery(
            new URLSearchParams('?lat=51.5074&lng=0.1278&zoom=18')
        )).toEqual({
            latitude: 51.5074,
            longitude: 0.1278,
            zoom: 18
        });
    });
    test('Can specify custom fallback state', () => {
        expect(parsePositionQuery(new URLSearchParams(), initialPositionState)).toEqual(initialPositionState);
    });
});
