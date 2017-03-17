import CircularProgress from "material-ui/CircularProgress";

import BaseComponent from "../../components/base-component";
import {buildsRepository} from "../../repositories/builds-repository";
import EndReleaseSelector from "../../components/EndReleaseSelector";
import ErrorHandler from "../../handlers/error-handler";
import Events from "../../models/events";
import {globalEventEmitter} from "../../utils/global-event-emitter";
import StartReleaseSelector from "../../components/StartReleaseSelector";
import ExtendedTicketsList  from "../../components/ExtendedTicketsList";

export default class Releases extends BaseComponent
{
    constructor(props)
    {
        super(props);
        
        this.state =
        {
            isLoading: true,
            upcomingReleases: null
        };
    }

    componentDidMount()
    {
        super.componentDidMount();

        this._onTicketsUpdates = this.onTicketsUpdated.bind(this);
        globalEventEmitter.addListener(Events.TICKETS_UPDATED, this._onTicketsUpdates);

        this.loadReleases();
    }

    componentWillUnmount()
    {
        globalEventEmitter.removeListener(Events.TICKETS_UPDATED, this._onTicketsUpdates);

        super.componentWillUnmount();
    }

    loadReleases()
    {
        buildsRepository.getUpcomingReleases()
            .then(upcomingReleases =>
            {
                if (!this.m_isMounted)
                    return;

                this.setState(
                {
                    isLoading: false,
                    upcomingReleases: upcomingReleases
                });
            })
            .catch(error =>
            {
                if (!this.m_isMounted)
                    return;

                ErrorHandler.showErrorMessage(error);

                this.setState(
                {
                    isLoading: false
                });
            });
    }

    onTicketsUpdated(tickets)
    {
        let upcomingReleases = this.state.upcomingReleases;

        for (let release of upcomingReleases.releasesTickets)
        {
            for (let ticket of release.tickets)
            {
                let updatedTicket = tickets.find(ut => ut.ticketNumber === ticket.ticketNumber);
                if (!updatedTicket)
                    continue;

                ticket.author = updatedTicket.author;
                ticket.dateTime = updatedTicket.dateTime;
                ticket.gitTags = updatedTicket.gitTags;
                ticket.message = updatedTicket.message;
                ticket.status = updatedTicket.status;
            }
        }

        this.forceUpdate();
    }
    
    render()
    {
        if (this.state.isLoading)
        {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3" style={{ textAlign: "center"}}>
                            <h1>Loading releases.</h1>
                            <p>This might take up to a minute.</p>
                            <CircularProgress size={60} />
                        </div>
                    </div>
                </div>
            );
        }

        if (!this.state.upcomingReleases)
        {
            return (
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-6 col-md-offset-3" style={{ textAlign: "center"}}>
                            <h1>An error occurred when loading releases</h1>
                            <p>Refresh the page to re-try loading releases.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="container-fluid" style={{ paddingTop: "1em" }}>
                <div className="row">
                    <div className="col-md-6">
                        <StartReleaseSelector upcomingReleases={this.state.upcomingReleases} />
                    </div>
                    <div className="col-md-6">
                        <EndReleaseSelector upcomingReleases={this.state.upcomingReleases} />
                    </div>
                </div>
                <ExtendedTicketsList upcomingReleases={this.state.upcomingReleases} />
            </div>
        );
    }
}