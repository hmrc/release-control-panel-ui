import BaseComponent from "../base-component";
import CreateReleaseFilter from "../CreateReleaseFilter";
import EpicCell from "../EpicCell";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import RefreshTicketsStatuses from "../RefreshTicketsStatuses";
import SearchFlags from "../../models/search-flags"
import semver from "semver";
import Settings from "../../utils/settings";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

export default class ExtendedTicketList extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            endReleaseName: null,
            releases: [],
            searchFlags: Settings.getSearchFlags(),
            startReleaseName: null
        };
    }

    componentDidMount()
    {
        super.componentDidMount();

        this._onEndReleaseChanged = this.onEndReleaseChanged.bind(this);
        this._onSearchFlagsChanged = this.onSearchFlagsChanged.bind(this);
        this._onStartReleaseChanged = this.onStartReleaseChanged.bind(this);

        globalEventEmitter.addListener(Events.END_RELEASE_CHANGED, this._onEndReleaseChanged);
        globalEventEmitter.addListener(Events.SEARCH_FLAGS_CHANGED, this._onSearchFlagsChanged);
        globalEventEmitter.addListener(Events.START_RELEASE_CHANGED, this._onStartReleaseChanged);
    }

    componentWillUnmount()
    {
        globalEventEmitter.removeListener(Events.END_RELEASE_CHANGED, this._onEndReleaseChanged);
        globalEventEmitter.removeListener(Events.SEARCH_FLAGS_CHANGED, this._onSearchFlagsChanged);
        globalEventEmitter.removeListener(Events.START_RELEASE_CHANGED, this._onStartReleaseChanged);

        super.componentWillUnmount();
    }

    filterTickets(tickets)
    {
        if (this.state.searchFlags & SearchFlags.HideResolvedTasks)
        {
            tickets = tickets.filter(ticket => ["Closed", "Resolved"].indexOf(ticket.status) === -1);
        }

        return tickets;
    }

    findEpicByKey(epicKey)
    {
        return this.props.upcomingReleases.epics.find(epic => epic.ticketNumber === epicKey);
    }

    getCombinedTicketList()
    {
        let filteredReleases = this.getFilteredReleases();
        let filteredTicketsArray = filteredReleases.map(release => this.filterTickets(release.tickets)).reduce((previous, current) => previous.concat(current), []);
        let uniqueTicketsArray = [];
        filteredTicketsArray.forEach(ticket =>
        {
            if (uniqueTicketsArray.findIndex(ut => ut.ticketNumber === ticket.ticketNumber) !== -1)
                return;

            uniqueTicketsArray.push(ticket);
        });

        return uniqueTicketsArray;
    }

    getFilteredReleases()
    {
        let releases = this.state.releases;

        if (this.state.searchFlags & SearchFlags.HideCompletedReleases)
        {
            releases = releases.filter(release =>
            {
                return release.tickets.some(ticket => ["Closed", "Resolved"].indexOf(ticket.status) === -1);
            });
        }

        return releases;
    }

    onEndReleaseChanged(name)
    {
        if (!this.m_isMounted)
            return;
        
        this.setState(
        {
            endReleaseName: name
        });

        this.updateReleasesAndTicketsList(this.state.startReleaseName, name);
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

    onStartReleaseChanged(release)
    {
        if (!this.m_isMounted)
            return;
        
        let releaseName = release;
        if (release === true) // this means it is a production release
        {
            releaseName = null;

            let productionVersions = this.props.upcomingReleases.productionVersions;
            let upcomingReleases = this.props.upcomingReleases.upcomingReleases;

            // Finding the release name based on the versions
            for (var releaseIndex = upcomingReleases.length - 1; releaseIndex >= 0; releaseIndex--)
            {
                let currentRelease = upcomingReleases[releaseIndex];
                let isMatch = productionVersions.every(pv =>
                {
                    return currentRelease.projectVersions.some(crpv => crpv.name == pv.name && semver.lte(crpv.version, pv.version));
                });

                if (isMatch)
                {
                    releaseName = currentRelease.name;
                    break;
                }
            }
        }

        this.setState(
        {
            startReleaseName: releaseName
        });

        this.updateReleasesAndTicketsList(releaseName, this.state.endReleaseName);
    }

    showCombinedList()
    {
        return !!(this.state.searchFlags & SearchFlags.CombineTasks);
    }

    updateReleasesAndTicketsList(startReleaseName, endReleaseName)
    {
        if (!endReleaseName || !startReleaseName)
        {
            this.setState(
            {
                releases: []
            });
            return;
        }

        let releases = [];
        let foundStart = false;
        let foundEnd = false;

        this.props.upcomingReleases.releasesTickets.forEach(release =>
        {
            if (foundEnd)
                return;

            if (!foundStart)
            {
                if (startReleaseName === release.name)
                    foundStart = true;
                else
                    return;
            }

            releases.push(release);

            if (endReleaseName === release.name)
            {
                foundEnd = true;
            }
        });

        this.setState(
        {
            releases: releases
        });
    }

    render()
    {
        return (
            <div className="row">
                <div className="col-md-12">
                    <h2>JIRA tickets</h2>
                    {/*<RefreshTicketsStatuses />*/}
                    <CreateReleaseFilter startReleaseName={this.state.startReleaseName} endReleaseName={this.state.endReleaseName} />
                     {
                        (() =>
                        {
                            if (this.state.releases.length === 0)
                            {
                                return <p>Select "FROM" and "TO" releases in order to see tickets.</p>;
                            }
                        })()
                    }
                    {
                        (() =>
                        {
                            if (this.showCombinedList())
                            {
                                return (
                                    <Table>
                                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                            <TableRow>
                                                <TableHeaderColumn className="ticket-number">#</TableHeaderColumn>
                                                <TableHeaderColumn className="ticket-summary">Summary</TableHeaderColumn>
                                                <TableHeaderColumn className="ticket-epic">Epic</TableHeaderColumn>
                                                <TableHeaderColumn className="ticket-tags">Git tags</TableHeaderColumn>
                                                <TableHeaderColumn className="ticket-date">Date</TableHeaderColumn>
                                                <TableHeaderColumn className="ticket-status">Status</TableHeaderColumn>
                                                <TableHeaderColumn className="ticket-author">Author</TableHeaderColumn>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody displayRowCheckbox={false}>
                                            {this.renderTicketsList(this.getCombinedTicketList())}
                                        </TableBody>
                                    </Table>
                                );
                            }
                            else
                            {
                                return this.getFilteredReleases().map((release, index) =>
                                {
                                    return (
                                        <div key={index}>
                                            <h2>{release.name}</h2>
                                            <Table>
                                                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                                                    <TableRow>
                                                        <TableHeaderColumn className="ticket-number">#</TableHeaderColumn>
                                                        <TableHeaderColumn className="ticket-summary">Summary</TableHeaderColumn>
                                                        <TableHeaderColumn className="ticket-epic">Epic</TableHeaderColumn>
                                                        <TableHeaderColumn className="ticket-tags">Git tags</TableHeaderColumn>
                                                        <TableHeaderColumn className="ticket-date">Date</TableHeaderColumn>
                                                        <TableHeaderColumn className="ticket-status">Status</TableHeaderColumn>
                                                        <TableHeaderColumn className="ticket-author">Author</TableHeaderColumn>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody displayRowCheckbox={false}>
                                                    {this.renderTicketsList(release.tickets)}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    );
                                });
                            }
                        })()
                    }
                </div>
            </div>
        );
    }

    renderTicketsList(tickets)
    {
        let rowStyle = { height: "auto" };
        let columnStyle = { height: "auto", paddingTop: "10px", paddingBottom: "10px", verticalAlign: "top" };
        let filteredTickets = this.filterTickets(tickets);

        if (!this.showCombinedList() && !filteredTickets.length)
        {
            return (
                <TableRow>
                    <TableRowColumn>
                        <p>No JIRA tickets found for this release.</p>
                    </TableRowColumn>
                </TableRow>
            );
        }

        return filteredTickets.map((ticket, ticketIndex) =>
        {
            return (
                <TableRow key={ticketIndex} style={rowStyle}>
                    <TableRowColumn className="ticket-number" style={columnStyle}>{ticketIndex + 1}</TableRowColumn>
                    <TableRowColumn className="ticket-summary" style={columnStyle}><a href={ticket.url} target="_blank" rel="external">{ticket.ticketNumber}: {ticket.message}</a></TableRowColumn>
                    <TableRowColumn className="ticket-epic" style={columnStyle}>
                        {
                            (() =>
                            {
                                if (ticket.epicKey)
                                {
                                    return <EpicCell epic={this.findEpicByKey(ticket.epicKey)} />;
                                }
                            })()
                        }
                    </TableRowColumn>
                    <TableRowColumn className="ticket-tags" style={columnStyle}>
                        <ul className="list-unstyled">
                            {
                                (ticket.gitTags||[]).map((tag, tagIndex) =>
                                {
                                    return (
                                        <li key={tagIndex}>{tag}</li>
                                    );
                                })
                            }
                        </ul>
                    </TableRowColumn>
                    <TableRowColumn className="ticket-date" style={columnStyle}>{ticket.dateTime.toLocaleString("en-GB")}</TableRowColumn>
                    <TableRowColumn className="ticket-status" style={columnStyle}>
                        {
                            (() =>
                            {
                                switch (ticket.status)
                                {
                                    case "In Progress":
                                    case "In PO Review":
                                    case "Dev Ready":
                                    case "Dev Complete":
                                        return <span className="label label-danger">{ticket.status}</span>;
                                    case "In QA":
                                        return <span className="label label-warning">{ticket.status}</span>;
                                    case "QA Complete":
                                    case "Resolved":
                                        return <span className="label label-success">{ticket.status}</span>;
                                    default:
                                        return <span className="label label-default">{ticket.status}</span>;
                                }
                            })()
                        }
                    </TableRowColumn>
                    <TableRowColumn className="ticket-author" style={columnStyle}>{ticket.author}</TableRowColumn>
                </TableRow>
            );
        });
    }
}