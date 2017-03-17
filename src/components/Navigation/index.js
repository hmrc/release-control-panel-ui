import AppBar from "material-ui/AppBar";
import BaseComponent from "../base-component";
import {DefaultPage, Pages} from "../../models/pages";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import IconButton from "material-ui/IconButton";
import IconChangePassword from "material-ui/svg-icons/communication/vpn-key";
import IconCreateUser from "material-ui/svg-icons/social/person-add";
import IconHome from "material-ui/svg-icons/action/home";
import IconLogout from "material-ui/svg-icons/action/eject";
import IconMenu from "material-ui/svg-icons/navigation/menu";
import IconReleases from "material-ui/svg-icons/action/dns";
import IconReports from "material-ui/svg-icons/editor/multiline-chart";
import IconSettings from "material-ui/svg-icons/action/settings";
import LeftNav from "material-ui/Drawer";
import { ListItem } from "material-ui/List"
import PageActions from "../../models/page-actions";
import {projectsRepository} from "../../repositories/projects-repository";
import RaisedButton from "material-ui/RaisedButton";
import React from "react";
import Subheader from "material-ui/Subheader";
import { usersRepository } from "../../repositories/users-repository";

export default class Navigation extends BaseComponent
{
    constructor(props)
    {
        super(props);

        const user = usersRepository.getUser();

        this.state =
        {
            currentPage: DefaultPage,
            navigationOpen: false,
            pageAction: props.pageAction,
            projects: projectsRepository.getProjects(),
            userFullName: (user && user.fullName) || null
        };
    }

    changeNavigationState(open)
    {
        this.setState(
        {
            navigationOpen: open
        });
    }

    componentDidMount()
    {
        super.componentDidMount();

        this._onProfileLoaded = this.onProfileLoaded.bind(this);
        this._onLoggedOut = this.onLoggedOut.bind(this);

        globalEventEmitter.addListener(Events.LOGGED_OUT, this._onLoggedOut);
        globalEventEmitter.addListener(Events.PROFILE_LOADED, this._onProfileLoaded);
    }

    componentWillReceiveProps(nextProps)
    {
        this.setState({ pageAction: nextProps.pageAction });
    }

    componentWillUnmount()
    {
        globalEventEmitter.removeListener(Events.LOGGED_OUT, this._onLoggedOut);
        globalEventEmitter.removeListener(Events.PROFILE_LOADED, this._onProfileLoaded);

        super.componentWillUnmount();
    }

    onActionClick(pageAction)
    {
        globalEventEmitter.emit(Events.PAGE_ACTION_TRIGGERED, pageAction);
    }

    getRightAppBarElement()
    {
        const welcomeSubHeader = <Subheader style={{ color: "black" }}>{this.getWelcomeMessage()}</Subheader>;

        if (!this.state.pageAction)
        {
            return welcomeSubHeader;
        }

        let button;

        switch (this.state.pageAction)
        {
            case PageActions.Save:
                button = <RaisedButton
                    label="Save"
                    secondary={true}
                    onTouchTap={this.onActionClick.bind(this, PageActions.Save)}
                />;
                break;

            case PageActions.Create:
                button = <RaisedButton
                    label="Create"
                    secondary={true}
                    onTouchTap={this.onActionClick.bind(this, PageActions.Create)}
                />;
                break;
        }

        return (
            <div>
                <div style={{ display: "inline-block", marginRight: "1em" }}>
                    {welcomeSubHeader}
                </div>
                {button}
            </div>
        );
    }

    getTitle()
    {
        const titleBase = "Release Control Panel";
        let pageName = null;

        switch (this.state.currentPage)
        {
            case Pages.Home:
                pageName = "Home";
                break;

            case Pages.Releases:
                pageName = "Releases";
                break;

            case Pages.Reports:
                pageName = "Reports";
                break;

            case Pages.Settings:
                pageName = "Settings";
                break;

            case Pages.CreateUser:
                pageName = "Create user";
                break;

            case Pages.ChangePassword:
                pageName = "Change password";
                break;
        }

        if (pageName)
        {
            return `${titleBase} - ${pageName}`;
        }

        return titleBase;
    }

    getWelcomeMessage()
    {
        if (this.state.userFullName)
        {
            return `Hello, ${this.state.userFullName}`;
        }

        return "";
    }
    
    handleMenuItemClick(pageToOpen)
    {
        this.setState(
        {
            currentPage: pageToOpen,
            navigationOpen: false
        });

        if (pageToOpen == Pages.Logout)
        {
            usersRepository.logout()
                .then(() =>
                {
                    globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", "Bye!");
                });
            return;
        }
        
        globalEventEmitter.emit(Events.PAGE_CHANGED, pageToOpen);
    }

    onProfileLoaded(user)
    {
        if (!this.m_isMounted)
            return;

        this.setState({ userFullName: user.fullName });
    }

    onLoggedOut()
    {
        if (!this.m_isMounted)
            return;

        this.setState({ userFullName: null });
    }

    toggleNavigation()
    {
        this.changeNavigationState(!this.state.navigationOpen);
    }

    render()
    {
        return (
            <div>
                <AppBar
                    iconElementRight={this.getRightAppBarElement()}
                    title={this.getTitle()}
                    iconElementLeft={ <IconButton onTouchTap={this.toggleNavigation.bind(this)}><IconMenu /></IconButton> }
                />
                <LeftNav
                    docked={false}
                    open={this.state.navigationOpen}
                    onRequestChange={this.changeNavigationState.bind(this)}>
                    <AppBar
                        title="Menu"
                        showMenuIconButton={false}
                        onTitleTouchTap={this.toggleNavigation.bind(this)}
                        titleStyle={{ cursor: "pointer" }}
                        />
                    <ListItem
                        leftIcon={<IconHome />}
                        onTouchTap={this.handleMenuItemClick.bind(this, Pages.Home)}
                        primaryText="Home"
                        />
                    <ListItem
                        leftIcon={<IconReleases />}
                        onTouchTap={this.handleMenuItemClick.bind(this, Pages.Releases)}
                        primaryText="Releases"
                        />
                    <ListItem
                        leftIcon={<IconReports />}
                        onTouchTap={this.handleMenuItemClick.bind(this, Pages.Reports)}
                        primaryText="Reports"
                        />
                    <ListItem
                        leftIcon={<IconChangePassword />}
                        onTouchTap={this.handleMenuItemClick.bind(this, Pages.ChangePassword)}
                        primaryText="Change password"
                        />
                    <ListItem
                        leftIcon={<IconSettings />}
                        onTouchTap={this.handleMenuItemClick.bind(this, Pages.Settings)}
                        primaryText="Settings"
                        />
                    {
                        (() =>
                        {
                            if (usersRepository.getUser().admin)
                            {
                                return (
                                    <ListItem
                                        leftIcon={<IconCreateUser />}
                                        onTouchTap={this.handleMenuItemClick.bind(this, Pages.CreateUser)}
                                        primaryText="Create user"
                                        />
                                );
                            }
                        })()
                    }
                    <ListItem
                        leftIcon={<IconLogout />}
                        onTouchTap={this.handleMenuItemClick.bind(this, Pages.Logout)}
                        primaryText="Log out"
                        />
                </LeftNav>
            </div>
        );
    }
}