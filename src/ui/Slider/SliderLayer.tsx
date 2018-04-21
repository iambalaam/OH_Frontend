import * as React from 'react';
import * as Utils from '../../utils/time'
import SliderTile from './SliderTile'
import './Slider.css';

interface SliderLayerProps {
    tilePeriod: number,
    textFunc: (dateTime: Date) => string,
    dateTimeToPixels: (dateTime: Date) => number,
    pixelsToDateTime: (pixels: number) => Date,
    msPerPixel: number,
    opacity: number,
    animate: boolean,
    key: number
}

class SliderLayer extends React.Component<SliderLayerProps, {}> {
    renderAllTiles() {
        const tiles = [];
        if (this.props.opacity > 0) {
            for (
                let dT = Utils.floorDateTime(this.props.pixelsToDateTime(-innerWidth), this.props.tilePeriod);
                this.props.dateTimeToPixels(dT) < innerWidth * 1;
                dT = Utils.incrementDateTime(dT, 1, this.props.tilePeriod)
            ) {
                tiles.push({dateTime: dT})
            }
        }
        return tiles.map((tile) => this.renderTile(tile.dateTime));
    }

    renderTile(dateTime: Date) {
        const deltaX: number = this.props.dateTimeToPixels(dateTime);
        const width: number = this.props.dateTimeToPixels(Utils.incrementDateTime(dateTime, 1, this.props.tilePeriod)) - deltaX;
        return (
            <SliderTile
                translateX={deltaX}
                width={width}
                opacity={this.props.opacity}
                animate={this.props.animate}
                text={this.props.textFunc(dateTime)}
                key={dateTime.toString()}
            />
        )
    }

    render() {
        return (
            <div className='oh-slider-layer noselect'>
                {this.renderAllTiles()}
            </div>
        )
    }
}

export default SliderLayer;
