import * as React from 'react';
import MapBox from './MapBox';
import GetEventsIterator, {ApiGetEventsParams, Event} from '../../api/getEvents';
import {floorDateTime, incrementDateTime, DAY, dateTimeToPixels, SELECTION_WIDTH} from '../../utils/time';
import {PositionState} from '../../state/reducers/position'
import {TimeState} from '../../state/reducers/time';
import Action from '../../state/actions/action';
import {UPDATE_EVENTS} from '../../state/actions/events';

interface MapApiRootProps {
    position: PositionState,
    time: TimeState,
    events: UPDATE_EVENTS,
    dispatch: (action: Action<any>) => Action<any>
}

export interface bounds {n: number, e: number, s: number, w: number}
interface MapApiRootState {
    events: Event[],
    bounds: bounds
}


class MapApiRoot extends React.Component<MapApiRootProps, MapApiRootState> {
    constructor(props: MapApiRootProps) {
        super(props);
        this.state = {
            events: [],
            // TODO: make some logic for guessing bounds
            bounds: {n: 85, s: -85, e: 360, w: 0}
        };
    }

    componentDidMount() {
        const now = new Date();
        const start = floorDateTime(now, DAY);
        const end = incrementDateTime(start, 1, DAY)
        const apiGetParams: ApiGetEventsParams = {
            latitude: 51.5,
            longitude: 0,
            earliestStartTime: start.toISOString(),
            latestStartTime: end.toISOString(),
            maximumRadius: 20
        }
        const eventIterator = new GetEventsIterator(apiGetParams, (events: any[]) => {
            this.props.dispatch({
                type: UPDATE_EVENTS,
                payload: this.props.events.concat(events)
            })
        });
        eventIterator.getAllEvents();
    }

    render() {
        const {n, e, s, w} = this.state.bounds;
        const dt2px = (dt: Date) => dateTimeToPixels(this.props.time, dt)
        return (
            <MapBox
                events={this.props.events.filter((event) => (
                    (dt2px(event.finish) > - SELECTION_WIDTH / 2)
                    && (dt2px(event.start) < SELECTION_WIDTH / 2)
                    && (event.lat < n)
                    && (event.lat > s)
                    && (event.lng < e)
                    && (event.lng > w)
                ))}
                position={this.props.position}
                dispatch={this.props.dispatch}
            />
        );
    }
}

export default MapApiRoot;
