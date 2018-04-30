import {ApiRequest, apiGET} from './root';

export interface Event {
    id: string
    text: string,
    description: string,
    lat: number,
    lng: number,
    start: Date,
    finish: Date
}

export interface ApiGetEventsParams {
    latitude: number,
    longitude: number,
    minimumRadius?: number,
    maximumRadius: number,
    earliestStartTime: string,
    latestStartTime: string,
    excludedIds?: string[]
    lockDateTime?: Date
}
export interface ApiPaginationModel {
    pageNumber: number,
    totalPages: number,
    next: string,
    previous: string
}
export interface ApiEventModel {
    id: string,
    attributes: {
        name: string,
        description: string,
        start: string,
        finish: string,
        location: {
            type: string,
            latitude: number,
            longitude: number
        },
        category: 'MUSIC',
        tags: string[]
    },
    source: {
        provider: 'OVERHEAR',
        providerId: string
    }
}
export interface ApiGetEventsModel {
    pagination: ApiPaginationModel,
    resources: ApiEventModel[]
}

const parseGetEventsRes = (data: ApiGetEventsModel): Event[] => {
    if (!data || !data.resources) {
        console.debug('No events in api response');
    }
    return data.resources.map(event => {
        const attributes = event.attributes;
        return {
            id: event.id,
            text: 'OH_',
            description: attributes.description,
            lat: attributes.location.latitude,
            lng: attributes.location.longitude,
            start: new Date(attributes.start),
            finish: new Date(attributes.finish)
        }
    })
}

export default class getEventsIterator {
    params: ApiGetEventsParams | string;
    hasNext: boolean;
    nextQueryParams: string;
    callback: (events: Event[]) => void;

    constructor(params: ApiGetEventsParams | string, callback: (e: Event[]) => void) {
        this.params = params;
        this.callback = callback;
        this.hasNext = true;
    }



    getNextEvents() {
        return new Promise((resolve, reject) => {
            if (!this.hasNext) {
                reject();
            }
            const params: ApiRequest = {
                method: 'GET',
                path: 'api/events/map',
                queryParams: this.params
            }
            resolve(apiGET(params)
                .then((json: ApiGetEventsModel) => {
                    this.callback(parseGetEventsRes(json));
                    if (!json.pagination.next) {
                        this.hasNext = false;
                    }
                    this.params = json.pagination.next;
                })
                .catch((err) => {
                    console.error(err);
                }));
        })

    }

    getAllEvents(max: number = 10) {
        if (max < 1 || !this.hasNext) {
            return;
        }
        this.getNextEvents()
            .then(() => {
                return this.getAllEvents(max - 1);
            })
            .catch((err) => {
                console.error(err);
            })
    }
}
