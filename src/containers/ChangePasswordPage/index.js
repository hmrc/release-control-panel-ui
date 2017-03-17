import BaseComponent from "../../components/base-component";
import ErrorHandler from "../../handlers/error-handler";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import { isNullOrEmpty } from "../../utils/string";
import PageActions from "../../models/page-actions";
import { usersRepository } from "../../repositories/users-repository";
import TextField from "material-ui/TextField";

export default class ChangePassword extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state = { };
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

    doChangePassword()
    {
        const state = this.state;
        const errorMessages = [];

        if (isNullOrEmpty(state.oldPassword))
        {
            errorMessages.push("Enter old password");
        }

        if (isNullOrEmpty(state.newPassword))
        {
            errorMessages.push("Enter new password");
        }

        if (isNullOrEmpty(state.confirmPassword))
        {
            errorMessages.push("Confirm your new password");
        }

        if (state.newPassword !== state.confirmPassword)
        {
            errorMessages.push("New password and confirmed password doesn't match");
        }

        if (errorMessages.length)
        {
            const message = "There were some problems with the form:\n\n" + errorMessages[0];
            globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "error", message);
            return;
        }

        usersRepository.changePassword(state.oldPassword, state.newPassword)
            .then(() =>
            {
                globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", "Successfully changed password.");
            })
            .catch(ErrorHandler.showErrorMessage);
    }

    handleFieldChange(event)
    {
        const state = this.state;
        state[event.target.name] = event.target.value;
        this.forceUpdate();
    }

    onPageActionTriggered(pageAction)
    {
        if (pageAction !== PageActions.Save)
            return;

        this.doChangePassword();
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
                                    name="oldPassword"
                                    type="password"
                                    floatingLabelText="Old password"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    name="newPassword"
                                    type="password"
                                    floatingLabelText="New password"
                                    onChange={this.handleFieldChange.bind(this)}
                                    style={{ width: "100%" }}
                                />
                            </div>
                            <div className="form-group">
                                <TextField
                                    name="confirmPassword"
                                    type="password"
                                    floatingLabelText="Confirm password"
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