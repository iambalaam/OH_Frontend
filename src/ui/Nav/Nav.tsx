import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {push} from 'react-router-redux';
import {store, dispatch} from '../../state/store';
import {user} from '../../state/reducers/user'
import Action from '../../state/actions/action'
import {notify} from '../../state/actions/notif';
import {signIn, signOut} from '../../state/actions/user';
import './Nav.css';

interface NavProps {
    user: user,
    dispatch: (action: Action<any>) => Action<any>
}

class Nav extends React.Component<NavProps, {}> {
    getSignedInLogo() {
        return this.props.user.isSignedIn ? 'person' : 'person_outline';
    }
    toggleSignIn() {
        return this.props.user.isSignedIn ? signOut() : signIn();
    }

    render() {
        return (
            <nav>
                <span id="logo"><a>
                    <h1
                        onClick={() => dispatch(push('/'))}
                        className='noselect'
                    >OH</h1>
                </a></span>
                <span id="buttons">
                    <button
                        type="button"
                        onClick={() => this.props.dispatch(this.toggleSignIn())}
                        className="material-icons">{this.getSignedInLogo()}
                    </button>
                    <button
                        type="button"
                        onClick={() => this.props.dispatch(notify('WARN', 'This message is a warning'))}
                        className="material-icons">menu
                    </button>
                </span>
            </nav>
        )
    }
}

const mapStateToProps = (state: store) => ({user: state.user})
const mapDispatchToProps = (dispatch: Dispatch<Action<any>>) => ({dispatch: (action: Action<any>) => dispatch(action)})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Nav)
