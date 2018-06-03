import * as React from 'react';
import styled from 'styled-components';
import {Event} from '../../api/getEvents';
import * as hot8 from '../../img/Hot8-250.jpg';

import './Pin.css'
// import hot8 from '../../img/Hot8-250.jpg';

const ImageGradient = (url: string) => styled.div`
    /* HACK: Make this relative */
    position: fixed;
    height: 100px;
    width: 100%;
    top: 0;
    height: 100px;
    background:
        linear-gradient(transparent, black),
        url(${url});
`

const Button = styled.button`
    height: 20px;
    width: 50%;

`

interface PinProps {
    event: Event;
}

export const Pin = (props: PinProps) => {
    const {event} = props;
    const Image = ImageGradient(hot8);
    return (
        <div className='oh-pin-container'>
            <span className="oh-pin-icon">OH_</span>
            {/* Opactity fade on :hover */}
            <div className="oh-pin-content">
                <Image />
                <div className="oh-pin-scroll">
                    {/* TODO: this should be text */}
                    <h1>{event.description}</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </div>
            </div>
            <div className="oh-pin-footer">
                <Button>Details</Button>
                <Button>Tickets</Button>
            </div>
        </div>
    )
}
