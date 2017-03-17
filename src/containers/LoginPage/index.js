import BaseComponent from "../../components/base-component";
import Events from "../../models/events";
import FlatButton from "material-ui/FlatButton";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import { usersRepository } from "../../repositories/users-repository";
import TextField from "material-ui/TextField";

export default class Login extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            loggingIn: false,
            login: "",
            password: ""
        };
    }

    handleLoginClick(event)
    {
        event.preventDefault();
        
        this.setState({ loggingIn: true });

        usersRepository.login(this.state.login, this.state.password)
            .then(user =>
            {
                if (this.m_isMounted)
                {
                    this.setState({ loggingIn: true });
                }
                
                globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", `Welcome, ${user.fullName}`);
            })
            .catch(ex =>
            {
                if (ex.status == 401)
                {
                    globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "error", "Invalid username or password.");
                }
                else
                {
                    globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "error", "Unknown error.");
                }
            })
    }

    handleLoginChange(event)
    {
        this.setState({
            login: event.target.value
        });
    }

    handlePasswordChange(event)
    {
        this.setState({
            password: event.target.value
        });
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

                        <form onSubmit={this.handleLoginClick.bind(this)}>
                            <div className="form-group">
                                    <TextField
                                        name="username"
                                        floatingLabelText="Username"
                                        onChange={this.handleLoginChange.bind(this)}
                                        style={{ width: "100%" }}
                                    />
                            </div>
                            <div className="form-group">
                                    <TextField
                                        name="password"
                                        type="password"
                                        floatingLabelText="Password"
                                        onChange={this.handlePasswordChange.bind(this)}
                                        style={{ width: "100%" }}
                                    />
                            </div>

                            <div className="form-group" style={{ textAlign: "center" }}>
                                <FlatButton
                                    label="Login"
                                    primary={true}
                                    // onTouchTap={this.handleLoginClick.bind(this)}
                                    type="submit"
                                />
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        );
    }
}