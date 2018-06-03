import * as React from 'react';
import ReactMapGL, {Viewport, Marker} from 'react-map-gl';
// Required stylesheet
import 'mapbox-gl/dist/mapbox-gl.css';
import {Event} from '../../api/getEvents';
import {PositionState} from '../../state/reducers/position';
import Action from '../../state/actions/action';
import {updatePosition} from '../../state/actions/position';
import {DEBOUNCE} from '../../utils/query';
import {push} from 'react-router-redux';
import {Pin} from './Pin';

const URLSearchParams = require('url-search-params');

interface MapBoxProps {
    events: Event[],
    position: PositionState,
    dispatch: (action: Action<any>) => Action<any>
}

interface MapBoxState {
    intervalUpdateQuery?: NodeJS.Timer
}

export default class MapBox extends React.Component<MapBoxProps, MapBoxState> {

    width: number = window.innerWidth;
    height: number = window.innerHeight - 95;

    onChange(positionState: Viewport) {
        const {latitude, longitude, zoom} = positionState;
        this.props.dispatch(updatePosition({latitude, longitude, zoom}));
        if (this.state && this.state.intervalUpdateQuery) {
            clearTimeout(this.state.intervalUpdateQuery);
        }
        const timeoutId = setTimeout(() => {
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('lng', longitude);
            queryParams.set('lat', latitude);
            queryParams.set('zoom', zoom);
            this.props.dispatch(push(`/?${queryParams.toString()}`));
        }, DEBOUNCE);
        this.setState({intervalUpdateQuery: timeoutId})

    }

    render() {
        return (
            <div
                id='oh-map'
                ref={(div) => {
                    if (div !== null) {
                        this.width = div.clientWidth
                        this.height = div.clientHeight
                    }
                }}
            >
                <ReactMapGL
                    width={this.width}
                    height={this.height}
                    mapboxApiAccessToken={'pk.eyJ1IjoiaWFtYmFsYWFtIiwiYSI6ImNqOGFncHNzcDBkMnQzMHF3d3RmOTN3bGsifQ.qxxsYiL0Rq6m24_vAcU-NA'}
                    mapStyle='mapbox://styles/mapbox/streets-v9'
                    onViewportChange={(positionState) => this.onChange(positionState)}
                    {...this.props.position}
                >
                    {this.props.events.map((event) => (
                        <Marker
                            latitude={event.lat} longitude={event.lng}
                            captureScroll={true} captureClick={true} captureDoubleClick={true} captureDrag={true}
                            key={event.id}
                        >
                            <Pin event={event} key={event.id} />
                        </Marker>
                    ))}
                </ReactMapGL>
            </div>
        )
    }
}
