import App from "./app.jsx";

import { configRepository } from "./repositories/config-repository";
import darkBaseTheme from "material-ui/styles/baseThemes/darkBaseTheme";
import ErrorDialog from "./components/ErrorDialog";
import Events from "./models/events";
import getMuiTheme from "material-ui/styles/getMuiTheme";
import { globalEventEmitter } from "./utils/global-event-emitter";
import injectTapEventPlugin from "react-tap-event-plugin";
import LinearProgress from "material-ui/LinearProgress";
import Login from "./containers/LoginPage";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Notifications from "./components/Notifications";
import React from "react";
import { render, findDOMNode } from "react-dom";
import { usersRepository } from "./repositories/users-repository";

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin();

let darkMuiTheme = getMuiTheme(darkBaseTheme);

export default class Main extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            isLoadingConfig: true,
            isLoggedOut: true,
            loadingConfigFailed: false
        };
    }

    componentDidMount()
    {
        globalEventEmitter.addListener(Events.LOGGED_IN, this.onLoggedIn.bind(this));
        globalEventEmitter.addListener(Events.LOGGED_OUT, this.onLoggedOut.bind(this));

        this.loadProfile();
    }

    loadConfig()
    {
        configRepository.loadConfig()
            .then(() =>
            {
                this.setState(
                {
                    isLoadingConfig: false
                });
            })
            .catch(() =>
            {
                this.setState(
                {
                    isLoadingConfig: false,
                    loadingConfigFailed: true
                });
            });
    }

    loadProfile()
    {
        usersRepository.getProfile()
            .then(user =>
            {
                globalEventEmitter.emit(Events.LOGGED_IN, user);
            })
            .catch(() =>
            {
                this.setState(
                {
                    isLoadingConfig: false,
                    isLoggedOut: true
                });
            })
    }

    onLoggedIn()
    {
        this.setState(
        {
            isLoggedOut: false,
            isLoadingConfig: true,
            loadingConfigFailed: false
        });

        this.loadConfig();
    }
    
    onLoggedOut()
    {
        this.setState(
        {
            isLoggedOut: true
        });
    }

    render()
    {
        let content;
        if (this.state.isLoggedOut)
        {
            content = <Login />;
        }
        else if (this.state.isLoadingConfig)
        {
            content = (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-12" style={{ textAlign: "center" }}>
                            <h2>Loading projects</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-offset-4 col-md-4">
                            <LinearProgress mode="indeterminate" />
                        </div>
                    </div>
                </div>
            );
        }
        else if (this.state.loadingConfigFailed)
        {
            content = (
                <div>

                </div>
            );
        }
        else
        {
            content = <App />;
        }

        let contentWrapper = (
            <div>
                <ErrorDialog />
                <Notifications />
                {content}
            </div>
        );

        return (
            <MuiThemeProvider muiTheme={darkMuiTheme}>
                {contentWrapper}
            </MuiThemeProvider>
        );
    }
}

render(<Main />, document.getElementById("app"));