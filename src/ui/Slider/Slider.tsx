import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {store} from '../../state/store';
import {TimeState} from '../../state/reducers/time'
import {updateTime} from '../../state/actions/time'
import Action from '../../state/actions/action'
import * as Utils from '../../utils/time';
import SliderLayer from './SliderLayer'
import SliderTile from './SliderTile'
import './Slider.css';
import {DEBOUNCE} from '../../utils/query';
import {push} from 'react-router-redux';

const URLSearchParams = require('url-search-params');

//===========//
// Constants //
//===========//
const FADE_DIST = 0.5;
const CLICK_THRESHOLD = 2;
const TOUCH_THRESHOLD = 4;
// LINKED: Slider.scss click animate
// const CLICK_ANIMATE = 150;

const THRESHOLD_HOURS = Utils.HOUR / 20;
const THRESHOLD_DAYS = Utils.DAY / 100;
const THRESHOLD_WEEKS = Utils.WEEK / 100;
const THRESHOLD_MONTHS = Utils.MONTH / 100;

const createOpacityFunc = (min: number, max: number) => {
    const gradient = 1 / FADE_DIST;
    const logMin = Math.log(min)
    const logMax = Math.log(max)
    const midpoint = (logMax + logMin) / 2;
    const spread = (logMax - logMin) / 2;
    return (x: number) => 0.6 + gradient * (spread - Math.abs(Math.log(x) - midpoint));
}

const layers = [
    {
        tilePeriod: Utils.HOUR,
        opacityFunc: createOpacityFunc(Utils.MIN_MS_PER_PIXEL * 0.7, THRESHOLD_HOURS),
        textFunc: (dateTime: Date) => dateTime.getHours().toString()
    }, {
        tilePeriod: Utils.DAY,
        opacityFunc: createOpacityFunc(THRESHOLD_HOURS, THRESHOLD_DAYS),
        textFunc: (dateTime: Date) => dateTime.toString().split(' ')[0] + '\n' + dateTime.getDate()
    }, {
        tilePeriod: Utils.WEEK,
        opacityFunc: createOpacityFunc(THRESHOLD_DAYS, THRESHOLD_WEEKS),
        textFunc: (dateTime: Date) => dateTime.toString().split(' ')[0] + '\n' + dateTime.getDate()
    }, {
        tilePeriod: Utils.MONTH,
        opacityFunc: createOpacityFunc(THRESHOLD_WEEKS, THRESHOLD_MONTHS),
        textFunc: (dateTime: Date) => dateTime.toString().split(' ')[1]
    }, {
        tilePeriod: Utils.YEAR,
        opacityFunc: createOpacityFunc(THRESHOLD_MONTHS, Utils.MAX_MS_PER_PIXEL * 1.3),
        textFunc: (dateTime: Date) => dateTime.getFullYear().toString()
    }
]

interface SliderState {
    previousDateTime: Date,
    currentDateTime: Date,
    // The start of each drag
    mouseDown: {clientX: number, clientY: number} | undefined,
    touchDown: {clientX: number, clientY: number} | undefined,
    animate: boolean,
    intervalUpdateNow: NodeJS.Timer,
    intervalUpdateQuery: NodeJS.Timer
}

interface SliderProps {
    time: TimeState,
    dispatch: (action: Action<any>) => Action<any>
}

class Slider extends React.Component<SliderProps, SliderState> {
    //================//
    // Initialisation //
    //================//
    constructor(props: SliderProps) {
        super(props);
        this.state = {
            previousDateTime: new Date(),
            currentDateTime: new Date()
        } as SliderState
    }
    componentDidMount() {
        this.addEventListeners();
        const intervalUpdateNow = setInterval(
            () => {this.setState({currentDateTime: new Date()} as SliderState)}, 10 * Utils.SECOND);
        this.setState({intervalUpdateNow: intervalUpdateNow} as SliderState);
    }
    componentWillUnmount() {
        clearInterval(this.state.intervalUpdateNow);
    }

    updateState(selectedDateTime: Date, msPerPixel: number = this.props.time.msPerPixel) {
        this.props.dispatch(updateTime({
            selectedDateTime: selectedDateTime,
            msPerPixel: msPerPixel
        }));
        if (this.state && this.state.intervalUpdateQuery) {
            clearTimeout(this.state.intervalUpdateQuery);
        }
        const timeoutId = setTimeout(() => {
            const {time} = this.props;
            const queryParams = new URLSearchParams(window.location.search);
            queryParams.set('time', time.selectedDateTime.toISOString());
            queryParams.set('range', time.msPerPixel * Utils.SELECTION_WIDTH);
            this.props.dispatch(push(`/?${queryParams.toString()}`));
        }, DEBOUNCE);
        this.setState({intervalUpdateQuery: timeoutId});
    }
    //==========//
    // Handlers //
    //==========//
    handleMouseDown(e: MouseEvent) {
        if (this.state.touchDown === undefined) {
            this.setState({
                mouseDown: e,
                animate: false,
                previousDateTime: this.props.time.selectedDateTime
            });
        }
    }
    handleMouseMove(e: MouseEvent) {
        if (this.state.mouseDown !== undefined) {
            this.setState({animate: false})
            const newX = e.clientX;
            const oldX = this.state.mouseDown.clientX;
            this.updateState(Utils.timeDelta(
                this.state.previousDateTime,
                (oldX - newX) * this.props.time.msPerPixel));
        }
        e.preventDefault();
    }
    handleMouseUp(e: MouseEvent) {
        if (this.state.mouseDown !== undefined) {
            const distance = Math.sqrt(
                (this.state.mouseDown.clientX - e.clientX) ** 2 +
                (this.state.mouseDown.clientY - e.clientY) ** 2);
            if (distance <= CLICK_THRESHOLD) {
                this.setState({animate: true});
                this.updateState(Utils.pixelsToDateTime(
                    this.props.time,
                    this.state.mouseDown.clientX - innerWidth / 2
                ));
            }
        }
        this.setState({mouseDown: undefined});
    }
    handleScroll(e: WheelEvent) {
        const {time} = this.props;
        this.setState({animate: false})
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
            this.updateState(Utils.pixelsToDateTime(time, e.deltaX))
        } else {
            const scale = 1 + (e.deltaY / 1000);
            const newMsPerPixel = this.props.time.msPerPixel * scale;
            if (newMsPerPixel > Utils.MIN_MS_PER_PIXEL && newMsPerPixel < Utils.MAX_MS_PER_PIXEL) {
                const x = e.clientX - innerWidth / 2;
                this.updateState(
                    Utils.pixelsToDateTime(time, x * (1 - scale)),
                    time.msPerPixel * scale
                );
            }
        }
        e.preventDefault();
    }
    handleTouchDown(e: TouchEvent) {
        if (this.state.mouseDown === undefined) {
            if (e.touches.length === 1) {
                this.setState({
                    touchDown: e.touches[0],
                    animate: false,
                    previousDateTime: this.props.time.selectedDateTime
                })
            } else if (e.touches.length === 2) {

            }
        }
        e.preventDefault();
    }
    handleTouchMove(e: TouchEvent) {
        if (this.state.touchDown !== undefined) {
            if (e.touches.length === 1) {
                const newX = e.touches[0].clientX;
                const oldX = this.state.touchDown.clientX;
                this.updateState(Utils.timeDelta(
                    this.state.previousDateTime,
                    (oldX - newX) * this.props.time.msPerPixel
                ))
                e.preventDefault();
            } else if (e.touches.length === 2) {
                console.log(e)
            }
        }

    }
    handleTouchEnd(e: TouchEvent) {
        if (this.state.touchDown !== undefined) {
            if (e.touches.length === 0) {
                const distance = Math.sqrt(
                    (this.state.touchDown.clientX - e.changedTouches[0].clientX) ** 2 +
                    (this.state.touchDown.clientY - e.changedTouches[0].clientY) ** 2);
                if (distance <= TOUCH_THRESHOLD) {
                    this.setState({animate: true});
                    this.updateState(Utils.pixelsToDateTime(
                        this.props.time,
                        this.state.touchDown.clientX - innerWidth / 2
                    ))
                }
            }
            this.setState({touchDown: undefined});
        }
    }

    handleKeyDown(e: KeyboardEvent) {
        const key = e.keyCode ? e.keyCode : e.which;
        if (key === 37) { // Left
            this.setState({animate: true});
            this.updateState(Utils.pixelsToDateTime(this.props.time, -100))
        }
        if (key === 39) {// right
            this.setState({animate: true});
            this.updateState(Utils.pixelsToDateTime(this.props.time, 100))
        }
        if (key === 38) { // Up
            const {time} = this.props;
            const newMsPerPixel = time.msPerPixel * 1.1;
            if (newMsPerPixel < Utils.MAX_MS_PER_PIXEL) {
                this.setState({animate: true})
                this.updateState(time.selectedDateTime, time.msPerPixel * 1.1)
            }
        }
        if (key === 40) { // Down
            const {time} = this.props;
            const newMsPerPixel = time.msPerPixel * 0.9;
            if (newMsPerPixel > Utils.MIN_MS_PER_PIXEL) {
                this.setState({animate: true})
                this.updateState(time.selectedDateTime, time.msPerPixel * 0.9)
            }
        }
        e.preventDefault();
    }
    //===========//
    // Listeners //
    //===========//
    addEventListeners() {
        this.setState({
            mouseDown: undefined,
            touchDown: undefined,
            animate: false
        });
        const slider = document.getElementById('oh-slider-container');
        if (slider) {
            slider.addEventListener('mousedown', (e) => this.handleMouseDown(e));
            slider.addEventListener('wheel', (e) => this.handleScroll(e));
            document.addEventListener('mouseup', (e) => this.handleMouseUp(e));
            document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
            // FIXME: any
            slider.addEventListener('touchstart', (e) => this.handleTouchDown(e as any));
            document.addEventListener('touchmove', (e) => this.handleTouchMove(e as TouchEvent), {passive: false} as any);
            // FIXME: any
            document.addEventListener('touchend', (e) => this.handleTouchEnd(e as any));
            slider.addEventListener('keydown', (e) => this.handleKeyDown(e));
        }

    }

    //===========//
    // Rendering //
    //===========//
    renderCurrentTime() {
        return (
            <SliderTile
                translateX={Utils.dateTimeToPixels(this.props.time, this.state.currentDateTime)}
                width={0}
                opacity={0.7}
                animate={this.state.animate}
                key={'now'}
                id={'oh-now'}
            />
        )
    }
    renderSelection() {
        return (
            <SliderTile
                translateX={(-Utils.SELECTION_WIDTH) / 2}
                width={Utils.SELECTION_WIDTH}
                opacity={0.4}
                animate={false}
                key={'selection'}
                id={'oh-selection'}
            />
        )
    }
    renderAllLayers() {
        return layers.map(
            (layer) => this.renderLayer(layer.tilePeriod, layer.opacityFunc, layer.textFunc)
        );
    }
    renderLayer(tilePeriod: number, opacityFunc: (value: number) => number, textFunc: (dateTime: Date) => string) {
        const opacity = opacityFunc(this.props.time.msPerPixel)
        if (opacity > 0) {
            return (
                <SliderLayer
                    tilePeriod={tilePeriod}
                    textFunc={textFunc}
                    dateTimeToPixels={(x) => Utils.dateTimeToPixels(this.props.time, x)}
                    pixelsToDateTime={(dT) => Utils.pixelsToDateTime(this.props.time, dT)}
                    msPerPixel={this.props.time.msPerPixel}
                    opacity={opacityFunc(this.props.time.msPerPixel)}
                    animate={this.state.animate}
                    key={tilePeriod}
                />
            )
        } else {
            return;
        }
    }
    render() {
        return (
            <div
                id='oh-slider-container'
                tabIndex={0}
            >
                {this.renderAllLayers()}
                {this.renderCurrentTime()}
                {this.renderSelection()}
            </div>
        )
    }
}

const mapStateToProps = (state: store) => ({time: state.time});
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({dispatch: (action: Action<any>) => dispatch(action)});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Slider);
