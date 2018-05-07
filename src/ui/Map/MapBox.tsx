import * as React from 'react';
import ReactMapGL, {Viewport} from 'react-map-gl';
// Required stylesheet
import 'mapbox-gl/dist/mapbox-gl.css';
import {PositionState} from '../../state/reducers/position';
import Action from '../../state/actions/action';
import {updatePosition} from '../../state/actions/position';
import {DEBOUNCE} from '../../utils/query';
import {push} from 'react-router-redux';

const URLSearchParams = require('url-search-params');

interface MapBoxProps {
    position: PositionState,
    dispatch: (action: Action<any>) => Action<any>
}

interface MapBoxState {
    width: number,
    height: number,
    intervalUpdateQuery?: NodeJS.Timer
}

export default class MapBox extends React.Component<MapBoxProps, MapBoxState> {

    constructor(props: any) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight
        };
    }

    componentDidMount() {
        const container = document.querySelector('#oh-map') as HTMLDivElement;
        this.setViewportDimensions(container);
    }

    setViewportDimensions(div: HTMLDivElement | null) {
        if (div !== null) {
            const {offsetWidth, offsetHeight} = div;
            if (offsetWidth !== this.state.width && offsetHeight !== this.state.height) {
                this.setState({
                    width: offsetWidth,
                    height: offsetHeight
                })
            }
        }
    }

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
            <div id='oh-map'>
                <ReactMapGL
                    width={this.state.width}
                    height={this.state.height}
                    mapboxApiAccessToken={'pk.eyJ1IjoiaWFtYmFsYWFtIiwiYSI6ImNqOGFncHNzcDBkMnQzMHF3d3RmOTN3bGsifQ.qxxsYiL0Rq6m24_vAcU-NA'}
                    mapStyle='mapbox://styles/mapbox/streets-v9'
                    onViewportChange={(positionState) => this.onChange(positionState)}
                    {...this.props.position}
                />
            </div>
        )
    }
}
