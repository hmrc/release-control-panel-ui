import BaseComponent from "../../components/base-component";
import ErrorHandler from "../../handlers/error-handler";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import PageActions from "../../models/page-actions";
import TextField from "material-ui/TextField";
import { usersRepository } from "../../repositories/users-repository";

export default class Settings extends BaseComponent
{
    constructor(props)
    {
        super(props);

        const user = usersRepository.getUser();

        this.state = {
            user: user
        };
    }

    componentDidMount()
    {
        super.componentDidMount();

        this._onPageActionTriggered = this.onPageActionTriggered.bind(this);

        globalEventEmitter.addListener(Events.PAGE_ACTION_TRIGGERED, this._onPageActionTriggered);
    }

    componentWillUnmount()
    {
        globalEventEmitter.removeListener(Events.PAGE_ACTION_TRIGGERED, this._onPageActionTriggered);

        super.componentWillUnmount();
    }

    handleFieldChange(event)
    {
        const user = this.state.user;
        user[event.target.name] = event.target.value;
        this.forceUpdate();
    }

    onPageActionTriggered(pageAction)
    {
        if (pageAction !== PageActions.Save)
            return;

        this.doSaveChanges();
    }

    doSaveChanges()
    {
        const state = this.state;

        usersRepository.updateSettings(this.state.user)
            .then(() =>
            {
                globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", "Settings updated.");
            })
            .catch(error =>
            {
                ErrorHandler.showErrorMessage(error);
            })
    }

    render()
    {
        var user = this.state.user;
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-2">
                        <h2>CI-BUILD settings</h2>
                        <div className="form-group">
                                <TextField
                                    name="ciBuildUserName"
                                    floatingLabelText="UserName"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                    value={user.ciBuildUserName || ""}
                                />
                        </div>
                        <div className="form-group">
                                <TextField
                                    name="ciBuildApiToken"
                                    type="password"
                                    floatingLabelText="API Token"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                    value={user.ciBuildApiToken || ""}
                                />
                        </div>
                    </div>

                    <div className="col-md-2 col-md-offset-1">
                        <h2>CI-QA settings</h2>
                        <div className="form-group">
                            <TextField
                                name="ciQaUserName"
                                floatingLabelText="UserName"
                                onChange={this.handleFieldChange.bind(this)}
                                style={{ width: "100%" }}
                                value={user.ciQaUserName || ""}
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                name="ciQaApiToken"
                                type="password"
                                floatingLabelText="API Token"
                                onChange={this.handleFieldChange.bind(this)}
                                style={{ width: "100%" }}
                                value={user.ciQaApiToken || ""}
                            />
                        </div>
                    </div>

                    <div className="col-md-2 col-md-offset-1">
                        <h2>CI-Staging settings</h2>
                        <div className="form-group">
                            <TextField
                                name="ciStagingUserName"
                                floatingLabelText="UserName"
                                onChange={this.handleFieldChange.bind(this)}
                                style={{ width: "100%" }}
                                value={user.ciStagingUserName || ""}
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                name="ciStagingApiToken"
                                type="password"
                                floatingLabelText="API Token"
                                onChange={this.handleFieldChange.bind(this)}
                                style={{ width: "100%" }}
                                value={user.ciStagingApiToken || ""}
                            />
                        </div>
                    </div>

                    <div className="col-md-2 col-md-offset-1">
                        <h2>JIRA settings</h2>
                        <div className="form-group">
                            <TextField
                                name="jiraUserName"
                                floatingLabelText="UserName"
                                onChange={this.handleFieldChange.bind(this)}
                                style={{ width: "100%" }}
                                value={user.jiraUserName || ""}
                            />
                        </div>
                        <div className="form-group">
                            <TextField
                                name="jiraPassword"
                                type="password"
                                floatingLabelText="Password"
                                onChange={this.handleFieldChange.bind(this)}
                                style={{ width: "100%" }}
                                value={user.jiraPassword || ""}
                            />
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}