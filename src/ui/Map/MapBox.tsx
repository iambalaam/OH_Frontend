import * as React from 'react';
import ReactMapGL from 'react-map-gl';
// Required stylesheet
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBoxState {
    container?: React.Ref<HTMLDivElement>
    width: number,
    height: number,
    viewport: {
        latitude: number,
        longitude: number,
        zoom: number
    }
}

export default class MapBox extends React.Component<{}, MapBoxState> {

    constructor(props: any) {
        super(props);
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            viewport: {
                latitude: 51.5,
                longitude: 0,
                zoom: 8
            }
        };
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

    render() {
        return (
            <div
                id='oh-map'
                ref={(div) => {this.setViewportDimensions(div)}}
            >
                <ReactMapGL
                    width={this.state.width}
                    height={this.state.height}
                    mapboxApiAccessToken={'pk.eyJ1IjoiaWFtYmFsYWFtIiwiYSI6ImNqOGFncHNzcDBkMnQzMHF3d3RmOTN3bGsifQ.qxxsYiL0Rq6m24_vAcU-NA'}
                    onViewportChange={(viewport) => this.setState({viewport})}
                    {...this.state.viewport}
                />
            </div>
        )
    }
}
