import BaseComponent from "../base-component";
import Dialog from 'material-ui/Dialog';
import Events from "../../models/events";
import ErrorReason from "../../models/error-reason";
import FlatButton from "material-ui/FlatButton";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import ServiceType from "../../models/service-type";

export default class ErrorDialog extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            open: false
        };
    }

    componentDidMount()
    {
        super.componentDidMount();

        this._onErrorTriggered = this.onErrorTriggered.bind(this);

        globalEventEmitter.addListener(Events.ERROR_TRIGGERED, this._onErrorTriggered);
    }

    componentWillUnmount()
    {
        globalEventEmitter.removeListener(Events.ERROR_TRIGGERED, this._onErrorTriggered);

        super.componentWillUnmount();
    }

    getApplicationTitle()
    {
        if (!this.state.error)
            return "";

        switch (this.state.error.serviceType)
        {
            case ServiceType.ProdLeft:
                return "Releases for Prod-left";
            case ServiceType.ProdRight:
                return "Releases for Prod-right";
            case ServiceType.Nexus:
                return "Nexus";
            case ServiceType.CommandLine:
                return "Command line";
            case ServiceType.Jira:
                return "JIRA";
            case ServiceType.AppHistory:
                return "Releases history";
            case ServiceType.CiBuild:
                return "CI-BUILD";
            case ServiceType.CiQa:
                return "CI-QA";
            case ServiceType.CiStaging:
                return "CI-STAGING";
            case ServiceType.ReleaseControlPanel:
                return "Release Control Panel";
            default:
                return "Other service"
        }
    }

    getErrorDescription()
    {
        if (!this.state.error)
            return null;

        return (
            <div className="margin-top-medium">{this.getErrorReason()}</div>
        );
    }

    getErrorReason()
    {
        let jsonData = "";
        if (this.state.error.data)
        {
            jsonData = JSON.stringify(this.state.error.data, null, 1);

            let jsonDataLines = jsonData.split("\n");
            jsonDataLines = jsonDataLines.map(line =>
            {
                let indentation = 0;
                let indentationString = "";
                for (; line[indentation] === ' '; indentation++)
                {
                    indentationString += "&nbsp;&nbsp;&nbsp;&nbsp;"
                }

                return indentationString + line.substring(indentation);
            });

            jsonData = jsonDataLines.join("<br />");
        }

        switch (this.state.error.reason)
        {
            case ErrorReason.NotAuthenticated:
                return <p>Invalid username or password. Please correct the configuration.</p>;
            case ErrorReason.ServiceUnavailable:
                return <p>Service is currently down. Please check it manually before reporting problem to Web-Ops.</p>;
            case ErrorReason.InternalServerError:
                return <div><p>Internal server error:</p><p dangerouslySetInnerHTML={{__html: jsonData}} /></div>;
            case ErrorReason.Other:
                return <div><p>Unhandled error:</p><p dangerouslySetInnerHTML={{__html: jsonData}} /></div>;
            case ErrorReason.CouldNotParseXml:
                return <p>Could not parse XML returned from the service.</p>;
            case ErrorReason.CommandFailed:
                return <div><p>Command has failed: </p><p dangerouslySetInnerHTML={{__html: jsonData}} /></div>;
            case ErrorReason.CouldNotParseJson:
                return <p>Could not parse JSON returned from the service.</p>;
            case ErrorReason.ConnectionTimeout:
                return <p>Connection to the server has timed out. Check if you're connected to the VPN network first.</p>;
            case ErrorReason.InvalidUsernameOrPassword:
                return <p>Invalid username or password.</p>;
            case ErrorReason.UserIsLocked:
                return <p>This account is locked and does not allow editing.</p>;
            case ErrorReason.UserAlreadyExists:
                return <p>User with this username already exists.</p>;
            default:
                return <p>Unknown error.</p>
        }
    }

    handleCloseClick()
    {
        this.setState({
            open: false
        });
    }

    onErrorTriggered(error)
    {
        if (!this.m_isMounted)
            return;

        this.setState(
        {
            error: error,
            open: true
        });
    }

    render()
    {
        let dialogActions = [
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.handleCloseClick.bind(this)}
                />
        ];

        return (
            <Dialog
                title={this.getApplicationTitle()}
                actions={dialogActions}
                autoScrollBodyContent={true}
                modal={true}
                open={this.state.open}>
                {this.getErrorDescription()}
            </Dialog>
        );
    }
}