import BaseComponent from "../base-component";
import copyContent from "../../utils/copy-content";
import Deployment from "../Deployment";
import DropDownMenu from "material-ui/DropDownMenu";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import FlatButton from "material-ui/FlatButton";
import IconCopy from "material-ui/svg-icons/content/content-copy";
import MenuItem from "material-ui/MenuItem";
import ProjectVersionsList from "../ProjectVersionsList";
import SearchFlags from "../../models/search-flags";
import Settings from "../../utils/settings";
import TextField from "material-ui/TextField";

export default class EndReleaseSelector extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.buildMonitorInterval = null;
        this.state =
        {
            extraColumns:
            [
                {
                    heading: "Actions",
                    type: "template",
                    template: this.renderActionsCell.bind(this)
                }
            ],
            searchFlags: Settings.getSearchFlags(),
            selectedReleaseName: null,
            versions: null
        };
    }

    componentDidMount()
    {
        super.componentDidMount();

        this._onSearchFlagsChanged = this.onSearchFlagsChanged.bind(this);
        globalEventEmitter.addListener(Events.SEARCH_FLAGS_CHANGED, this._onSearchFlagsChanged);
    }

    componentWillUnmount()
    {
        if (this.buildMonitorInterval)
        {
            clearInterval(this.buildMonitorInterval);
        }

        globalEventEmitter.removeListener(Events.SEARCH_FLAGS_CHANGED, this._onSearchFlagsChanged);

        super.componentWillUnmount();
    }

    copyCommandLineScript()
    {
        if (copyContent("#commandLineScript"))
        {
            globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", "Copied.");
        }
        else
        {
            globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "error", "Could not copy the script. Check browser console for more info.");
        }
    }

    getCommandLineScript(versionsToShow)
    {
        return versionsToShow
            .map(project =>
            {
                let smProjectName = project.name.toUpperCase().replace(/-/g, "_");
                return `sm --restart ${smProjectName} -r ${project.version}`;
            })
            .join(" & ");
    }

    getFilteredReleases()
    {
        let upcomingReleases = this.props.upcomingReleases.upcomingReleases;
        let releasesTickets = this.props.upcomingReleases.releasesTickets;

        if (this.state.searchFlags & SearchFlags.HideCompletedReleases)
        {
            upcomingReleases = upcomingReleases.filter(release =>
            {
                let jiraReleaseInformation = releasesTickets.find(jr => jr.name === release.name);

                if (!jiraReleaseInformation)
                    return false;

                return jiraReleaseInformation.tickets.some(ticket => ["Closed", "Resolved"].indexOf(ticket.status) === -1);
            });
        }

        let releases =
        [
            {
                id: -1,
                name: ""
            }
        ];

        upcomingReleases.forEach(release =>
        {
            releases.push(
            {
                name: release.name
            });
        });

        return releases;
    }

    handleReleaseSelection(event, index, value)
    {
        let selectedValue = value;

        let upcomingReleases = this.props.upcomingReleases;
        let commandLineScript = "";
        let versionsToShow = null;
        let foundRelease = upcomingReleases.upcomingReleases.find(ur => ur.name === selectedValue);
        if (foundRelease)
        {
            versionsToShow = foundRelease.projectVersions;
            commandLineScript = this.getCommandLineScript(versionsToShow);
        }

        this.setState(
        {
            commandLineScript: commandLineScript,
            selectedReleaseName: selectedValue,
            versions: versionsToShow
        });

        globalEventEmitter.emit(Events.END_RELEASE_CHANGED, selectedValue);
    }

    onSearchFlagsChanged(flags)
    {
        if (!this.m_isMounted)
            return;
        
        this.setState(
        {
            searchFlags: flags
        });
    }

    render()
    {
        return (
            <div>
                <div className="form-group">
                    <DropDownMenu
                        autoWidth={false}
                        style={{ width: "100%" }}
                        onChange={this.handleReleaseSelection.bind(this)}
                        value={this.state.selectedReleaseName}>
                        {
                            this.getFilteredReleases().map((release, index) =>
                            {
                                return (
                                    <MenuItem
                                        key={index}
                                        disabled={release.disabled}
                                        primaryText={release.name}
                                        value={release.name} />
                                );
                            })
                        }
                    </DropDownMenu>
                </div>
                <div className="form-group" style={{ minHeight: "48px" }}>
                    {
                        (() =>
                        {
                            if (this.state.versions)
                            {
                                return (
                                    <div className="input-group">
                                        <span className="input-group-btn">
                                            <FlatButton
                                                icon={<IconCopy />}
                                                label="Copy 'sm' start script"
                                                primary={true}
                                                onTouchTap={this.copyCommandLineScript.bind(this)} />
                                        </span>
                                        <TextField
                                            disabled={true}
                                            id="commandLineScript"
                                            style={{ width: "100%" }}
                                            value={this.state.commandLineScript}
                                            />
                                    </div>
                                );
                            }
                        })()
                    }
                </div>
                <h2>To versions</h2>
                <ProjectVersionsList projects={this.state.versions}
                                     extraColumns={this.state.extraColumns} />
            </div>
        );
    }

    renderActionsCell(project)
    {
        return <Deployment projectName={project.name} version={project.version}/>;
    }
}