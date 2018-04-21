import * as React from 'react';
import './Slider.css';

interface SliderTileProps {
    translateX: number,
    width: number,
    opacity: number,
    animate: boolean,
    text?: string,
    id?: string,
    key: string
};

function SliderTile(props: SliderTileProps) {
    return (
        <span
            className={'oh-slider-tile' + (props.animate ? ' animate' : '')}
            id={props.id}
            style={{
                transform: `translateX(${props.translateX}px)`,
                width: props.width,
                opacity: props.opacity
            }}
        >
            {props.text}
        </span>
    );
}

export default SliderTile
