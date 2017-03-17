import BaseComponent from "../base-component";
import DropDownMenu from "material-ui/DropDownMenu";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import MenuItem from "material-ui/MenuItem";
import ProjectVersionsList from "../ProjectVersionsList";
import SearchFilters from "../SearchFilters";

export default class StartReleaseSelector extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            releases: this.getReleasesList(props),
            selectedReleaseName: null,
            showFilters: false,
            versions: null
        };
    }

    componentWillReceiveProps(newProps)
    {
        this.setState(
        {
            releases: this.getReleasesList(newProps)
        });
    }

    getReleasesList(props)
    {
        let upcomingReleases = props.upcomingReleases;
        let releases = [
            {
                name: ""
            },
            {
                name: "-- Current production manifest --",
                versions: upcomingReleases.productionVersions
            }
        ];

        let releasesWithPendingTickets = upcomingReleases.releasesTickets.filter(release =>
        {
            return release.tickets.some(ticket => ["Closed", "Released"].indexOf(ticket.status) === -1);
        });

        if (releasesWithPendingTickets.length > 0)
        {
            releases.push(
            {
                name: "-- Untested manifests --",
                disabled: true
            });

            releasesWithPendingTickets.forEach(rwpt =>
            {
                let releaseData = upcomingReleases.upcomingReleases.find(ur => ur.name === rwpt.name);
                releases.push(
                {
                    name: releaseData.name,
                    versions: releaseData.projectVersions
                });
            });
        }

        return releases;
    }

    

    handleReleaseSelection(event, index, value)
    {
        let selectedValue = value;

        let selectedProduction = false;
        let upcomingReleases = this.props.upcomingReleases;
        let versionsToShow = null;
        if (selectedValue && selectedValue.length > 0)
        {
            if (selectedValue.startsWith("--"))
            {
                selectedProduction = true;
                versionsToShow = upcomingReleases.productionVersions;
            }
            else
            {
                let foundRelease = upcomingReleases.upcomingReleases.find(ur => ur.name === selectedValue);
                if (foundRelease)
                {
                    versionsToShow = foundRelease.projectVersions;
                }
            }
        }

        this.setState(
        {
            selectedReleaseName: selectedValue,
            versions: versionsToShow
        });

        globalEventEmitter.emit(Events.START_RELEASE_CHANGED, selectedProduction ? true : selectedValue);
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
                            this.state.releases.map((release, index) =>
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
                    <SearchFilters />
                </div>
                <h2>From versions</h2>
                <ProjectVersionsList projects={this.state.versions} />
            </div>
        );
    }
}