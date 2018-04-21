import * as React from 'react';
import {Provider} from 'react-redux';
import Nav from './Nav/Nav';

import {Store} from 'redux';
import {store, history} from '../state/store';

import Slider from './Slider/Slider';
import NotificationBar from './Notifications/NotificationBar';
import Map from './Map/Map';
import {ConnectedRouter} from 'react-router-redux';
import {Switch, Route, Redirect} from 'react-router';

interface AppState {
    store: Store<store>
}

export interface RouteProps {
    history: History,
    location: Location,
    match: {
        path: string;
        url: string;
        params: any;
        isExact: boolean;
    }
}

class App extends React.Component<{}, AppState> {
    constructor(props: {}) {
        super(props);
        this.state = {store: store};
    }

    public render() {
        return (
            <Provider store={this.state.store}>
                <div className="App">
                    <header className="App-header">
                        <Nav />
                        <Slider />
                        <NotificationBar />
                    </header>
                    <ConnectedRouter history={history}>
                        <Switch>
                            <Route exact path='/404' component={() => (<h1>You #404'd it.</h1>)} /> */}
                            <Route exact path='/' component={Map} />
                            <Redirect from='/' to='/404' />
                        </Switch>
                    </ConnectedRouter>
                </div>
            </Provider>
        );
    }
}

export default App;
