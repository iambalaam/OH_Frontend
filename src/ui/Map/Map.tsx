import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Action from '../../state/actions/action';
import {UPDATE_POSITION} from '../../state/actions/position';
import {RouteProps} from '../App';
import {store} from '../../state/store';
import {PositionState} from '../../state/reducers/position';
import {TimeState} from '../../state/reducers/time';
import MapApiRoot from './MapApiRoot';
import './Map.css';

interface MapProps extends RouteProps {
    position: PositionState
    time: TimeState
    dispatch: any
}

class Map extends React.Component<MapProps, {}> {
    render() {
        const {position, time, dispatch} = this.props;
        return (
            <MapApiRoot
                position={position}
                time={time}
                dispatch={dispatch}
            />
        );
    }
}

const mapStateToProps = (state: store) => {
    return ({
        position: state.position,
        time: state.time
    });
};

const mapDispatchToProps = (dispatch: Dispatch<Action<UPDATE_POSITION>>) => ({dispatch: (action: Action<UPDATE_POSITION>) => dispatch(action)})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Map);
