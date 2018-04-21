import {PositionState} from "../state/reducers/position";

const parsePositionQuery = (queryParams: URLSearchParams, initialPositionState: PositionState = {}): PositionState => {
    const returnPosition = {...initialPositionState}
    if (queryParams.has('zoom')) {
        returnPosition.zoom = parseFloat((<string>queryParams.get('zoom')));
    }
    if (queryParams.has('lat') && queryParams.has('lng')) {
        returnPosition.latitude = parseFloat((<string>queryParams.get('lat')));
        returnPosition.longitude = parseFloat((<string>queryParams.get('lng')));
    }
    return returnPosition;
}

export {
    parsePositionQuery
};
