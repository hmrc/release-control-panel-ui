import CircularProgress from "material-ui/CircularProgress";
import Dialog from "material-ui/Dialog";
import Divider from "material-ui/Divider";
import FlatButton from "material-ui/FlatButton";
import RaisedButton from "material-ui/RaisedButton";
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';

import IconList from "material-ui/svg-icons/action/list";

import BaseComponent from "../base-component";
import {storiesRepository} from "../../repositories/stories-repository";

export default class EpicCell extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            detailsOpened: false,
            epicStoriesLoaded: false,
            stories: []
        };
    }

    handleCloseDetailsClick()
    {
        this.setState(
        {
            detailsOpened: false
        });
    }

    handleOpenDetailsClick()
    {
        this.setState(
        {
            detailsOpened: true
        });

        if (!this.state.epicStoriesLoaded)
        {
            this.loadEpicStories();
        }
    }

    loadEpicStories()
    {
        storiesRepository.getStoriesForEpic(this.props.epic.ticketNumber)
            .then(stories =>
            {
                if (!this.m_isMounted)
                    return;

                this.setState(
                {
                    epicStoriesLoaded: true,
                    stories: stories
                });
            });
    }

    render()
    {
        const epic = this.props.epic;
        const epicName = `${epic.ticketNumber}: ${epic.message}`;

        const dialogActions =[
            <FlatButton
                label="Close"
                primary={true}
                onTouchTap={this.handleCloseDetailsClick.bind(this)} />
        ];

        return (
            <div>
                <RaisedButton
                    icon={ <IconList /> }
                    onTouchTap={this.handleOpenDetailsClick.bind(this)}
                    primary={true}
                    style={{ minWidth: "45px", marginRight: "10px" }} />

                <a href={epic.url} target="_blank" rel="external">{epicName}</a>

                <Dialog
                    actions={dialogActions}
                    autoScrollBodyContent={true}
                    modal={true}
                    open={this.state.detailsOpened}
                    title={epicName}>
                    {
                        (() =>
                        {
                            if (!this.state.epicStoriesLoaded)
                            {
                                return (
                                    <div style={{ textAlign: "center" }}>
                                        <Divider />
                                        <h3>Loading stories for epic...</h3>
                                        <CircularProgress />
                                    </div>
                                );
                            }
                            else
                            {
                                return this.renderStoriesList();
                            }
                        })()
                    }
                </Dialog>
            </div>
        );
    }

    renderStoriesList()
    {
        return (
            <Table>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ width: "10%" }}>#</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "65%" }}>Summary</TableHeaderColumn>
                        <TableHeaderColumn style={{ width: "25%" }}>Status</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {
                        this.state.stories.map((ticket, index) =>
                        {
                            return (
                                <TableRow key={index}>
                                    <TableRowColumn style={{ width: "10%" }}>{index + 1}</TableRowColumn>
                                    <TableRowColumn style={{ width: "65%" }}><a href={ticket.url} target="_blank" rel="external">{ticket.ticketNumber}: {ticket.message}</a></TableRowColumn>
                                    <TableRowColumn style={{ width: "25%" }}>
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
                                </TableRow>
                            );
                        })
                    }
                </TableBody>
            </Table>
        );
    }
}