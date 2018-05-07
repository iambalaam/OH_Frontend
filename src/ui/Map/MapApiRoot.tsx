import * as React from 'react';
import MapBox from './MapBox';
import GetEventsIterator, {ApiGetEventsParams} from '../../api/getEvents';
import {floorDateTime, incrementDateTime, DAY} from '../../utils/time';
import {PositionState} from '../../state/reducers/position'
import {TimeState} from '../../state/reducers/time';
import Action from '../../state/actions/action';
import {UPDATE_POSITION} from '../../state/actions/position';

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
        const eventIterator = new GetEventsIterator(apiGetParams, (events: any[]) => {
            this.setState({events: this.state.events.concat(events)})
        });
        eventIterator.getAllEvents();
    }

    render() {
        return (
            <MapBox
                position={this.props.position}
                dispatch={this.props.dispatch}
            />
        );
    }
}

export default MapApiRoot;
