import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import Notification, {Message} from './Notification';
import Action from '../../state/actions/action';
import {DISMISS, dismiss} from '../../state/actions/notif';
import {store} from '../../state/store';
import './Notifications.css';

interface NotificationBarProps {
    notificationQueue: Message[]
    dismiss: () => Action<DISMISS>
}

// TODO: Make logic for smooth transitioning
class NotificationBar extends React.Component<NotificationBarProps, {}> {
    renderFirstNotif() {
        if (this.props.notificationQueue.length > 0) {
            return (
                <Notification
                    message={this.props.notificationQueue[0]}
                    dismiss={() => this.props.dismiss()}
                />
            )
        }
        return;
    }

    render() {
        return (
            <div id='oh-notif-bar'>
                {this.renderFirstNotif()}
            </div>
        )
    }
}

const mapStateToProps = (state: store) => ({notificationQueue: state.notifications.queue})
const mapDispatchToProps = (dispatch: Dispatch<Action<DISMISS>>) => ({dismiss: () => dispatch(dismiss())})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(NotificationBar)
