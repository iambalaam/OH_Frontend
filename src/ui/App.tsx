import * as React from 'react';
import {Provider} from 'react-redux';
import Nav from './Nav/Nav';
import './App.css';

import {Store} from 'redux';
import {store} from '../state/store';

import logo from '../img/logo.svg';
import Slider from './Slider/Slider';

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
                        <img src={logo} className="App-logo" alt="logo" />
                        <h1 className="App-title">Welcome to React</h1>
                    </header>
                    <p className="App-intro">
                        To get started, edit <code>src/App.tsx</code> and save to reload.
                </p>
                </div>
            </Provider>
        );
    }
}

export default App;
