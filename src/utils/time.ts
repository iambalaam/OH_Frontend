import {TimeState} from "../state/reducers/time";

//===========//
// Constants //
//===========//
const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 31 * DAY;
const YEAR = 365 * DAY;

const MIN_MS_PER_PIXEL = HOUR / 300;
const MAX_MS_PER_PIXEL = YEAR / 150;
const SELECTION_WIDTH = 100;

//=======//
// Tools //
//=======//
const timeDelta = (dateTime: Date, milliseconds: number): Date => {
    const variabledT = new Date();
    variabledT.setTime(dateTime.getTime() + milliseconds);
    return variabledT;
}

const floorDateTime = (dateTime: Date, period: number): Date => {
    if ([SECOND, MINUTE, HOUR, DAY, WEEK, MONTH, YEAR].indexOf(period) === -1) {
        throw new Error(`Cannot floor by arbitrary time ${period}.`)
    }
    const variabledT = new Date(dateTime);
    variabledT.setMilliseconds(0);
    if (period === SECOND) {return variabledT;}
    variabledT.setSeconds(0);
    if (period === MINUTE) {return variabledT;}
    variabledT.setMinutes(0);
    if (period === HOUR) {return variabledT;}
    variabledT.setHours(0);
    if (period === DAY) {return variabledT;}
    if (period === WEEK) {
        variabledT.setDate(variabledT.getDate() - (variabledT.getDay() + 6) % 7);
        return variabledT;
    }
    variabledT.setDate(1);
    if (period === MONTH) {return variabledT;}
    variabledT.setMonth(0);
    return variabledT;
}

const incrementDateTime = (dateTime: Date, n: number, period: number): Date => {
    if ([HOUR, DAY, WEEK, MONTH, YEAR].indexOf(period) === -1) {
        throw new Error(`Cannot floor by arbitrary time ${period}.`)
    }
    const variabledT = new Date();
    variabledT.setTime(dateTime.getTime());
    if (period === HOUR) {
        variabledT.setTime(dateTime.getTime() + (HOUR * n));
        return variabledT;
    }
    if (period === DAY) {
        variabledT.setDate(dateTime.getDate() + n);
        return variabledT;
    }
    if (period === WEEK) {
        return incrementDateTime(dateTime, (7 * n), DAY);
    }
    if (period === MONTH) {
        variabledT.setMonth(dateTime.getMonth() + n);
        return variabledT;
    }
    variabledT.setFullYear(dateTime.getFullYear() + n);
    return variabledT;
}

// Both these functions use an x-axis with the origin in the middle of the page.
// This is useful for css translations
const dateTimeToPixels = (time: TimeState, dateTime: Date) => {
    return (dateTime.getTime() - time.selectedDateTime.getTime()) / time.msPerPixel;
}
const pixelsToDateTime = (time: TimeState, x: number) => {
    return timeDelta(time.selectedDateTime, x * time.msPerPixel);
}

const parseTimeQuery = (queryParams: URLSearchParams, defaultTimeState: TimeState): TimeState => {
    if (queryParams.has('time') && queryParams.has('range')) {
        const time = <string>queryParams.get('time');
        const dateTime = new Date(time);
        const range = parseFloat(<string>queryParams.get('range'));
        if (time === dateTime.toISOString()
            && range >= MIN_MS_PER_PIXEL * SELECTION_WIDTH
            && range <= MAX_MS_PER_PIXEL * SELECTION_WIDTH) {
            return {
                selectedDateTime: dateTime,
                msPerPixel: range / SELECTION_WIDTH
            }
        }
    }
    return defaultTimeState;
}

export {
    SECOND,
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    MONTH,
    YEAR,
    MIN_MS_PER_PIXEL,
    MAX_MS_PER_PIXEL,
    SELECTION_WIDTH,
    timeDelta,
    floorDateTime,
    incrementDateTime,
    dateTimeToPixels,
    pixelsToDateTime,
    parseTimeQuery
};
