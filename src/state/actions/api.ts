import {notify} from './notif';

export const apiError = (message: string) => notify('ERROR', message);
