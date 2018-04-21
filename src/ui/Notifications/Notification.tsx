import * as React from 'react';

export type notificationType = 'INFO' | 'WARN' | 'ERROR';
export interface Message {messageType: notificationType, messageText: string}

interface NotificationProps {
    message: Message
    dismiss: () => void;
}

interface NotificationState {
    // FIXME: Is this where we should handle this logic?
    isDismissed: boolean;
}

// TODO: Make a proper inheritance structure for notifications
class Notification extends React.Component<NotificationProps, NotificationState> {
    constructor(props: NotificationProps) {
        super(props);
        this.state = {isDismissed: false};
    }
    dismiss() {
        this.props.dismiss();
    }
    getIcon(type: notificationType) {
        switch (type) {
            case 'INFO':
                return 'info';
            case 'WARN':
                return 'warning';
            case 'ERROR':
                return 'error';
            default: // This should never happen.
                throw new TypeError(`${type} is not a valid NotificationType.`)
        }

    }
    render() {
        return (
            <div className={'oh-notif-' + this.props.message.messageType +
                (this.state.isDismissed ? ' dismissed' : '')}>
                <span className='oh-notif-icon material-icons'>
                    {this.getIcon(this.props.message.messageType)}
                </span>
                <span className='oh-notif-message'>{this.props.message.messageText}</span>
                <span
                    className='oh-notif-dismiss material-icons'
                    onClick={() => this.dismiss()}
                >
                    close
                </span>
            </div>
        )
    }
}

export default Notification;
