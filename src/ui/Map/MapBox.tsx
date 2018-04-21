import * as React from 'react';
import {push, RouterAction} from 'react-router-redux';
import ReactMapboxGl, {Feature, Layer} from "react-mapbox-gl";
import {Map} from 'mapbox-gl'
import {bounds} from './MapApiRoot';
import {LngLatBounds} from 'mapbox-gl/dist/mapbox-gl';

import {Pin} from './Pin';

import Action from '../../state/actions/action';
import {updatePosition, UPDATE_POSITION} from '../../state/actions/position';
import {PositionState} from '../../state/reducers/position';
import {DEBOUNCE} from '../../utils/query';
import './Map.css';

const URLSearchParams = require('url-search-params');


// Define layout to use in Layer component
// FIXME: IMPROVE IMAGE IMPORTING IN WEBPACK
const pinImage = require('../../img/oh-pin');
const image = new Image();
image.src = `data:image/svg+xml;charset=utf-8,${pinImage}`;
const images: Array<any> = ['oh-pin', image];
const layoutLayer = {'icon-image': 'oh-pin'};



export interface Event {
    id: string
    text: string,
    description: string,
    lat: number,
    lng: number,
    start: Date,
    finish: Date
}

interface MapBoxProps {
    position: PositionState,
    dispatch: (action: Action<UPDATE_POSITION> | RouterAction) => Action<UPDATE_POSITION>
    events: Event[],
    setBounds: (bounds: bounds) => void
}

interface MapBoxEvent extends Map {
    transform: {
        _center: {
            lat: number,
            lng: number
        },
        _zoom: number
    }
}

interface MapBoxFeature {
    layer: any,
    properties: {
        id: string
    },
    geometry: {
        coordinates: Array<number>
    }
}

interface MapBoxState {
    timeoutId?: NodeJS.Timer,
    showPopup?: boolean,
    feature?: MapBoxFeature
}

const MapElement = ReactMapboxGl({
    accessToken: "pk.eyJ1IjoiaWFtYmFsYWFtIiwiYSI6ImNqOGFncHNzcDBkMnQzMHF3d3RmOTN3bGsifQ.qxxsYiL0Rq6m24_vAcU-NA"
});

const extractBounds = (bounds: LngLatBounds): bounds => {
    return {
        n: bounds.getNorth(), s: bounds.getSouth(), e: bounds.getEast(), w: bounds.getWest()
    }
}

class MapBox extends React.Component<MapBoxProps, MapBoxState> {
    handleMapMove(map: MapBoxEvent) {
        const {transform} = map;
        this.props.dispatch(updatePosition({
            latitude: transform._center.lat,
            longitude: transform._center.lng,
            zoom: transform._zoom
        }));
        if (this.state && this.state.timeoutId) {
            clearTimeout(this.state.timeoutId);
        }
        const timeoutId = setTimeout(() => {
            const {position, setBounds} = this.props;
            // HACK: Figure out why you get an ∞ loop if not in debouncer
            setBounds(extractBounds(map.getBounds()));
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('lat', position.latitude ? position.latitude.toString() : '');
            queryParams.set('lng', position.longitude ? position.longitude.toString() : '');
            queryParams.set('zoom', position.zoom ? position.zoom.toString() : '');
            this.props.dispatch(push(`/?${queryParams.toString()}`));
        }, DEBOUNCE)
        this.setState({timeoutId: timeoutId})
    }

    handleMouseEnter(e: any) {
        const feature = e.features[0];
        this.setState({
            feature: feature,
            showPopup: true
        });
    }

    handleMouseLeave() {
        this.setState({
            feature: undefined,
            showPopup: false
        });
    }

    renderPopup() {
        if (this.state && this.state.showPopup && this.state.feature) {
            const feature = this.state.feature;
            return (
                <Pin
                    event={this.props.events[feature.properties.id]}
                    coordinates={feature.geometry.coordinates}
                    onMouseLeave={() => this.handleMouseLeave()}
                />
            )
        } else {
            return;
        }
    }

    render() {
        const {position} = this.props;
        return (
            <div id='oh-map'>
                <MapElement
                    // Initialisation
                    onStyleLoad={(e: Map) => this.props.setBounds(extractBounds(e.getBounds()))}
                    center={[position.longitude || 0, position.latitude || 0]}
                    zoom={[position.zoom || 0]}
                    // Interaction
                    onMove={(e: Map) => this.handleMapMove(e as any)}

                    // Styling
                    style="mapbox://styles/mapbox/streets-v9"
                    containerStyle={{height: "100%", width: "100%"}}
                >
                    <Layer type='symbol' id='oh-pins' layout={layoutLayer} images={images}>
                        {this.props.events.map((event) => (
                            <Feature
                                key={event.id}
                                coordinates={[event.lng, event.lat]}
                                onMouseEnter={(e) => this.handleMouseEnter(e)}
                            />
                        ))}
                    </Layer>
                    {this.renderPopup()}
                </MapElement>
            </div >
        )
    }
}

export default MapBox;
