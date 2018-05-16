import * as React from 'react';
import {Marker} from 'react-map-gl';
import {Event} from '../../api/getEvents';

import './Pin.css'
import hot8 from '../../img/Hot8-250.jpg';

interface PinProps {
    event: Event;
}


export const Pin = (props: PinProps) => {

    return (
        <Marker
            latitude={props.event.lat}
            longitude={props.event.lng}
            captureScroll={true}
        >
            <div className='pin'>
                <img src={hot8} />
                <div className='pin-content'>
                    <h2>{props.event.description}</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div className='pin-footer'>
                    <button>1</button>
                    <button>2</button>
                </div>
            </div>
        </Marker>
    )
}
