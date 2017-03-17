import BaseComponent from "../../components/base-component";
import ErrorHandler from "../../handlers/error-handler";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import { isNullOrEmpty } from "../../utils/string";
import PageActions from "../../models/page-actions";
import TextField from "material-ui/TextField";
import { usersRepository } from "../../repositories/users-repository";

export default class CreateUser extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            user: {}
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

    doCreateUser()
    {
        const user = this.state.user;
        const errorMessages = [];
        
        if (isNullOrEmpty(user.userName))
        {
            errorMessages.push("Enter UserName");
        }

        if (isNullOrEmpty(user.password))
        {
            errorMessages.push("Enter password")
        }

        if (isNullOrEmpty(user.fullName))
        {
            errorMessages.push("Enter full name");
        }

        if (errorMessages.length)
        {
            const message = "There were some problems with the form:\n\n" + errorMessages[0];
            globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "error", message);
            return;
        }

        usersRepository.createUser(user)
            .then(() =>
            {
                globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", "User created.")
            })
            .catch(ErrorHandler.showErrorMessage)
    }

    handleFieldChange(event)
    {
        const user = this.state.user;
        user[event.target.name] = event.target.value;
        this.forceUpdate();
    }

    onPageActionTriggered(pageAction)
    {
        if (pageAction !== PageActions.Create)
            return;

        this.doCreateUser();
    }

    render()
    {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-6 col-md-offset-3" style={{ textAlign: "center" }}>
                        <h2>Release Control Panel</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2 col-md-offset-5">

                        <div>
                            <div className="form-group">
                                <TextField
                                    name="userName"
                                    floatingLabelText="UserName"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    name="password"
                                    type="password"
                                    floatingLabelText="Password"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="fullName"
                                    floatingLabelText="Full name"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="ciBuildUserName"
                                    floatingLabelText="CI-BUILD UserName"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="ciBuildApiToken"
                                    floatingLabelText="CI-BUILD Api Token"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="ciQaUserName"
                                    floatingLabelText="CI-QA UserName"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="ciQaApiToken"
                                    floatingLabelText="CI-QA Api Token"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="ciStagingUserName"
                                    floatingLabelText="CI-Staging UserName"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="ciStagingApiToken"
                                    floatingLabelText="CI-Staging Api Token"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="jiraUserName"
                                    floatingLabelText="JIRA UserName"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>

                            <div className="form-group">
                                <TextField
                                    name="jiraPassword"
                                    floatingLabelText="JIRA Password"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}