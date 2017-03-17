import BaseComponent from "./components/base-component";
import ChangePassword from "./containers/ChangePasswordPage";
import CreateUser from "./containers/CreateUserPage";
import {DefaultPage, Pages} from "./models/pages";
import Events from "./models/events";
import {globalEventEmitter} from "./utils/global-event-emitter";
import Navigation from "./components/Navigation";
import PageActions from "./models/page-actions";
import ProjectsList from "./containers/ProjectsListPage";
import Releases from "./containers/ReleasesPage";
import Reporting from "./containers/ReportingPage";
import Settings from "./containers/SettingsPage";

export default class App extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            currentPage: DefaultPage
        };
    }

    componentDidMount()
    {
        super.componentDidMount();

        this._onPageChanged = this.onPageChanged.bind(this);
        globalEventEmitter.addListener(Events.PAGE_CHANGED, this._onPageChanged);
    }

    componentWillUnmount()
    {
        super.componentWillUnmount();

        if (this._onPageChanged)
        {
            globalEventEmitter.removeListener(Events.PAGE_CHANGED, this._onPageChanged);
        }
    }

    onPageChanged(page)
    {
        if (!this.m_isMounted)
            return;
        
        this.setState(
        {
            currentPage: page
        });
    }

    render()
    {
        let Child;
        let childProps = {};
        let pageAction = null;

        switch (this.state.currentPage)
        {
            case Pages.Home:
                Child = ProjectsList;
                break;
        
            case Pages.Releases:
                Child = Releases;
                break;
        
            case Pages.Reports:
                Child = Reporting;
                break;
        
            case Pages.Settings:
                Child = Settings;
                pageAction = PageActions.Save;
                break;
        
            case Pages.CreateUser:
                Child = CreateUser;
                pageAction = PageActions.Create;
                break;
        
            case Pages.ChangePassword:
                Child = ChangePassword;
                pageAction = PageActions.Save;
                break;
        }

        return (
            <div>
                <Navigation pageAction={pageAction} />
                <Child {...childProps} />
            </div>
        );
    }
}