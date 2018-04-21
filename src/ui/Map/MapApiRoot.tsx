import * as React from 'react';
import GetEventsIterator, {ApiGetEventsParams} from '../../api/getEvents';
import {dateTimeToPixels, floorDateTime, incrementDateTime, DAY, SELECTION_WIDTH} from '../../utils/time';
import {PositionState} from '../../state/reducers/position'
import {TimeState} from '../../state/reducers/time';
import Action from '../../state/actions/action';
import {UPDATE_POSITION} from '../../state/actions/position';
import MapBox, {Event} from './MapBox';

interface MapApiRootProps {
    position: PositionState,
    time: TimeState,
    dispatch: (action: Action<UPDATE_POSITION>) => Action<UPDATE_POSITION>
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
        const eventIterator = new GetEventsIterator(apiGetParams, (events: Event[]) => {
            this.setState({events: this.state.events.concat(events)})
        });
        eventIterator.getAllEvents();
    }

    render() {
        const {bounds} = this.state;
        const dt2px = (dt: Date) => dateTimeToPixels(this.props.time, dt)
        return (
            <MapBox
                position={this.props.position}
                dispatch={this.props.dispatch}
                setBounds={(bounds) => this.setState({bounds: bounds})}
                events={this.state.events
                    .filter((event) => {
                        return (dt2px(event.finish) > - SELECTION_WIDTH / 2)
                            && (dt2px(event.start) < SELECTION_WIDTH / 2)
                            && (event.lat < bounds.n)
                            && (event.lat > bounds.s)
                            && (event.lng < bounds.e)
                            && (event.lng > bounds.w)
                    })}
            />
        );
    }
}

export default MapApiRoot;
