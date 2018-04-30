import {timeDelta, floorDateTime, incrementDateTime, SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, YEAR, parseTimeQuery, pixelsToDateTime, dateTimeToPixels} from './time';
import {TimeState} from '../state/reducers/time';

const URLSearchParams = require('url-search-params');

const testState: TimeState = {
    selectedDateTime: new Date(),
    msPerPixel: DAY / 400
}
const testDate = new Date(2017, 11, 25, 12)
export const testTimeState: TimeState = {
    selectedDateTime: new Date(2000, 0, 1),
    msPerPixel: HOUR / 100
}

describe('timeDelta()', () => {
    test('Test adding 0', () => {
        const dateTime = new Date(Math.floor(Math.random() * 10000000000000));
        expect(timeDelta(dateTime, 0)).toEqual(dateTime);
    });
    test('Test adding 2 hours', () => {
        const dateTime = new Date(Math.floor(Math.random() * 10000000000000));
        expect(timeDelta(dateTime, 2 * HOUR).getTime()).toEqual(dateTime.getTime() + 2 * HOUR);
    });
    test('Test negative time', () => {
        const dateTime = new Date(0);
        expect(timeDelta(dateTime, -2208988800000)).toEqual(new Date(1900, 0, 1));
    });
});

describe('floorDateTime()', () => {
    test('Floor by seconds', () => {
        const floor = floorDateTime(new Date(), SECOND);
        expect(floor.getMilliseconds()).toBe(0);
    });
    test('Floor by minutes', () => {
        const floor = floorDateTime(new Date(), MINUTE);
        expect(floor.getMilliseconds()).toBe(0);
        expect(floor.getSeconds()).toBe(0);
    });
    test('Floor by hours', () => {
        const floor = floorDateTime(new Date(), HOUR);
        expect(floor.getMilliseconds()).toBe(0);
        expect(floor.getSeconds()).toBe(0);
        expect(floor.getMinutes()).toBe(0);
    });
    test('Floor by days', () => {
        const floor = floorDateTime(new Date(), DAY);
        expect(floor.getMilliseconds()).toBe(0);
        expect(floor.getSeconds()).toBe(0);
        expect(floor.getMinutes()).toBe(0);
        expect(floor.getHours()).toBe(0);
    });
    test('Floor by weeks', () => {
        const floor = floorDateTime(new Date(), WEEK);
        expect(floor.getMilliseconds()).toBe(0);
        expect(floor.getSeconds()).toBe(0);
        expect(floor.getMinutes()).toBe(0);
        expect(floor.getHours()).toBe(0);
        expect(floor.getDay()).toBe(1);
    });
    test('Floor by months', () => {
        const floor = floorDateTime(new Date(), MONTH);
        expect(floor.getMilliseconds()).toBe(0);
        expect(floor.getSeconds()).toBe(0);
        expect(floor.getMinutes()).toBe(0);
        expect(floor.getHours()).toBe(0);
        expect(floor.getDate()).toBe(1);
    });
    test('Floor by years', () => {
        const floor = floorDateTime(new Date(), YEAR);
        expect(floor.getMilliseconds()).toBe(0);
        expect(floor.getSeconds()).toBe(0);
        expect(floor.getMinutes()).toBe(0);
        expect(floor.getHours()).toBe(0);
        expect(floor.getDate()).toBe(1);
        expect(floor.getMonth()).toBe(0);
    });
    test('Throw on unknown period', () => {
        expect(() => floorDateTime(new Date(), 1234567890)).toThrow();
    });
});

describe('incrementDateTime()', () => {
    test('Increment by 1 hour', () => {
        const dateTime = new Date();
        const newDateTime = incrementDateTime(dateTime, 1, HOUR);
        expect(newDateTime.getMilliseconds()).toBe(dateTime.getMilliseconds());
        expect(newDateTime.getSeconds()).toBe(dateTime.getSeconds());
        expect(newDateTime.getMinutes()).toBe(dateTime.getMinutes());
        expect(newDateTime.getHours()).toBe(dateTime.getHours() + 1);
    });
    test('Increment by 5 days', () => {
        const dateTime = new Date();
        const newDateTime = incrementDateTime(dateTime, 5, DAY);
        expect(newDateTime.getMilliseconds()).toBe(dateTime.getMilliseconds());
        expect(newDateTime.getSeconds()).toBe(dateTime.getSeconds());
        expect(newDateTime.getMinutes()).toBe(dateTime.getMinutes());
        expect(newDateTime.getDay()).toBe((dateTime.getDay() + 5) % 7);
    });
    test('Increment by 40 weeks', () => {
        const dateTime = new Date();
        const newDateTime = incrementDateTime(dateTime, 40, WEEK);
        expect(newDateTime.getMilliseconds()).toBe(dateTime.getMilliseconds());
        expect(newDateTime.getSeconds()).toBe(dateTime.getSeconds());
        expect(newDateTime.getMinutes()).toBe(dateTime.getMinutes());
        expect(newDateTime.getDay()).toBe(dateTime.getDay());
        // Cannot think of a way to test further
    });
    test.skip('Increment back by 2 months', () => {
        const dateTime = new Date();
        const newDateTime = incrementDateTime(dateTime, -2, MONTH);
        expect(newDateTime.getMilliseconds()).toBe(dateTime.getMilliseconds());
        expect(newDateTime.getSeconds()).toBe(dateTime.getSeconds());
        expect(newDateTime.getMinutes()).toBe(dateTime.getMinutes());
        expect(newDateTime.getDate()).toBe(dateTime.getDate());
        expect(newDateTime.getMonth()).toBe((dateTime.getMonth() - 2) % 12);
    });
    test('Increment back by 10 years', () => {
        const dateTime = new Date();
        const newDateTime = incrementDateTime(dateTime, 10, YEAR);
        expect(newDateTime.getMilliseconds()).toBe(dateTime.getMilliseconds());
        expect(newDateTime.getSeconds()).toBe(dateTime.getSeconds());
        expect(newDateTime.getMinutes()).toBe(dateTime.getMinutes());
        expect(newDateTime.getDate()).toBe(dateTime.getDate());
        expect(newDateTime.getMonth()).toBe(dateTime.getMonth());
        expect(newDateTime.getFullYear()).toBe(dateTime.getFullYear() + 10);
    });
    test('Throw on unknown period', () => {
        expect(() => incrementDateTime(new Date(), 1, 1234567890)).toThrow();
    });
    test.skip('Test daylight savings spring to skip forward', () => {
        const dateTime = new Date(2017, 2, 26, 0, 15, 0);
        const newDateTime = incrementDateTime(dateTime, 1, HOUR);
        expect(newDateTime).toEqual(new Date(2017, 2, 26, 2, 15, 0));
    })
    test.skip('Test daylight savings spring to skip forward (reverse)', () => {
        const dateTime = new Date(2017, 2, 26, 2, 45, 0);
        const newDateTime = incrementDateTime(dateTime, -1, HOUR);
        expect(newDateTime).toEqual(new Date(2017, 2, 26, 0, 45, 0));
    })
    const beforeAt0130 = 1509240600000;
    test('Test daylight savings autumn to skip back', () => {
        const dateTime = new Date(beforeAt0130);
        const newDateTime = incrementDateTime(dateTime, 1, HOUR);
        expect(newDateTime).toEqual(new Date(beforeAt0130 + HOUR));
    })
    test('Test daylight savings autumn to skip back (reverse)', () => {
        const dateTime = new Date(beforeAt0130 + HOUR);
        const newDateTime = incrementDateTime(dateTime, -1, HOUR);
        expect(newDateTime).toEqual(new Date(beforeAt0130));
    })
    test('Test leap year', () => {
        const dateTime = new Date(2020, 1, 28);
        const newDateTime = incrementDateTime(dateTime, 2, DAY);
        expect(newDateTime).toEqual(new Date(2020, 2, 1));
    })
});

describe('dateTimeToPixels()', () => {
    test('Has the selected time in the middle', () => {
        expect(dateTimeToPixels(testTimeState, testTimeState.selectedDateTime)).toEqual(0)
    });
    test('Left bound is correct', () => {
        expect(dateTimeToPixels(testTimeState, new Date(1999, 11, 31, 19))).toEqual(-500);
    });
    test('Right bound is correct', () => {
        expect(dateTimeToPixels(testTimeState, new Date(2000, 0, 1, 5))).toEqual(500);
    });
});

describe('pixelsToDateTime()', () => {
    test('Has the selected time in the middle', () => {
        expect(pixelsToDateTime(testTimeState, 0)).toEqual(testTimeState.selectedDateTime);
    });
    test('Left bound is correct', () => {
        expect(pixelsToDateTime(testTimeState, -500)).toEqual(new Date(1999, 11, 31, 19));
    });
    test('Right bound is correct', () => {
        expect(pixelsToDateTime(testTimeState, 500)).toEqual(new Date(2000, 0, 1, 5));
    });
});

describe('parseTimeQuery()', () => {
    test('Can parse empty query', () => {
        expect(parseTimeQuery(new URLSearchParams(''), testState)).toEqual(testState);
    });
    test('Can parse proper query', () => {
        expect(parseTimeQuery(new URLSearchParams(`?time=${testDate.toISOString()}&range=7200000`), testState))
            .toEqual({
                selectedDateTime: testDate,
                msPerPixel: 72000
            });
    });
    test('Will not parse only time', () => {
        expect(parseTimeQuery(new URLSearchParams(`?time=${testDate.toISOString()}`), testState)).toBe(testState);
    });
    test('Will not all invalid time format', () => {
        expect(parseTimeQuery(new URLSearchParams(`?time=${testDate.toString()}&range=7200000`), testState))
            .toBe(testState);
    });
    test('Will not allow range outside of bounds', () => {
        expect(parseTimeQuery(new URLSearchParams(`?time=${testDate.toISOString()}&range=1000`), testState))
            .toBe(testState);
    })
});

