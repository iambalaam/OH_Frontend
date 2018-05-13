import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Action from '../../state/actions/action';
import {RouteProps} from '../App';
import {store} from '../../state/store';
import {PositionState} from '../../state/reducers/position';
import {TimeState} from '../../state/reducers/time';
import {UPDATE_EVENTS} from '../../state/actions/events'
import MapApiRoot from './MapApiRoot';
import './Map.css';

interface MapProps extends RouteProps {
    position: PositionState
    time: TimeState,
    events: UPDATE_EVENTS
    dispatch: any
}

class Map extends React.Component<MapProps, {}> {
    render() {
        const {position, time, dispatch, events} = this.props;
        return (
            <MapApiRoot
                events={events}
                position={position}
                time={time}
                dispatch={dispatch}
            />
        );
    }
}

const mapStateToProps = (state: store) => {
    const {position, time, events} = state;
    return ({
        position,
        time,
        events
    });
};

const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({dispatch: (action: Action<any>) => dispatch(action)})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
