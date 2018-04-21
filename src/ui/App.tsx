import * as React from 'react';
import {Provider} from 'react-redux';
import Nav from './Nav/Nav';

import {Store} from 'redux';
import {store} from '../state/store';

import Slider from './Slider/Slider';
import NotificationBar from './Notifications/NotificationBar';

interface AppState {
    store: Store<store>
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
                </div>
            </Provider>
        );
    }
}

export default App;
