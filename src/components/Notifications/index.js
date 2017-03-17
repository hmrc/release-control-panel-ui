import BaseComponent from "../base-component";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import IconError from "material-ui/svg-icons/alert/error";
import IconSuccess from "material-ui/svg-icons/navigation/check";
import IconWarning from "material-ui/svg-icons/alert/warning";
import { red500, orange500, green500 } from "material-ui/styles/colors";
import Snackbar from "material-ui/Snackbar";

const NOTIFICATION_TIMEOUT = 2000;

export default class SmallSpinner extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.notificationTimeout = null;
        this.state =
        {
            isShown: false,
            message: "",
            type: ""
        };

        this._onShowNotification = this.onShowNotification.bind(this);
    }

    componentDidMount()
    {
        super.componentDidMount();

        globalEventEmitter.addListener(Events.SHOW_NOTIFICATION, this._onShowNotification);
    }

    componentWillUnmount()
    {
        globalEventEmitter.removeListener(Events.SHOW_NOTIFICATION, this._onShowNotification);

        super.componentWillUnmount();
    }

    onShowNotification(type, message)
    {
        if (!this.m_isMounted)
            return;

        if (this.notificationTimeout)
        {
            clearTimeout(this.notificationTimeout);
        }

        this.setState(
        {
            isShown: true,
            message: message,
            type: type
        });

        this.notificationTimeout = setTimeout(() =>
        {
            if (!this.m_isMounted)
                return;

            this.setState(
            {
                isShown: false
            });
        }, NOTIFICATION_TIMEOUT);
    }

    render()
    {
        let messageNode = <span className="vertical-align--middle">{this.state.message}</span>;
        let iconStyle = { marginRight: "10px" };
        switch (this.state.type)
        {
            case "error":
                messageNode = (
                    <div>
                        <IconError color={red500} className="vertical-align--middle" style={iconStyle} />
                        {messageNode}
                    </div>
                );
                break;

            case "warning":
                messageNode = (
                    <div>
                        <IconWarning color={orange500} className="vertical-align--middle" style={iconStyle} />
                        {messageNode}
                    </div>
                );
                break;

            case "success":
                messageNode = (
                    <div>
                        <IconSuccess color={green500} className="vertical-align--middle" style={iconStyle} />
                        {messageNode}
                    </div>
                );
                break;
        }

        return (
            <Snackbar
                message={messageNode}
                open={this.state.isShown} />
        );
    }
}