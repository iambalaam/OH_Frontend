import * as React from 'react';
import {Popup} from 'react-mapbox-gl';

import './Pin.css'
import hot8 from '../../img/Hot8-250.jpg';

interface PinProps {
    event: any;
    coordinates: Array<number>;
    onMouseLeave: () => void;
}


export const Pin = (props: PinProps) => {

    return (
        <a>
            <Popup
                coordinates={props.coordinates}
                onMouseLeave={() => props.onMouseLeave()}
            >
                <img src={hot8} />
                <div className='pin-img-shadow'></div>
                <div className='pin-content'>
                    {/* FIXME:  */}
                    <h2>{'something'}</h2>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                </div>
                <div className='pin-footer'>
                    <button>1</button>
                    <button>2</button>
                </div>
            </Popup>
        </a>
    )
}
