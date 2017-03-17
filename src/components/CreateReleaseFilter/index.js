import BaseComponent from "../base-component";
import ErrorHandler from "../../handlers/error-handler";
import IconReleaseFilter from "material-ui/svg-icons/content/filter-list";
import LinearProgress from "material-ui/LinearProgress";
import RaisedButton from "material-ui/RaisedButton";
import {storiesRepository} from "../../repositories/stories-repository";

export default class CreateReleaseFilters extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            createdFilters: {},
            createdFilterName: null,
            createdFilterUrl: null,
            isCreatingFilter: false
        };
    }

    canCreateReleaseFilter()
    {
        let startRelease = this.props.startReleaseName;
        let endRelease = this.props.endReleaseName;

        return startRelease && endRelease;
    }

    getCreatedFilter()
    {
        let startRelease = this.props.startReleaseName;
        let endRelease = this.props.endReleaseName;
        let filterKey = `${startRelease}-${endRelease}`;

        return this.state.createdFilters[filterKey];
    }

    handleCreateReleaseFilterClick()
    {
        if (!this.canCreateReleaseFilter())
        {
            alert("Please select release first.");
            return;
        }

        this.setState(
        {
            isCreatingFilter: true
        });

        storiesRepository.createReleaseFilter(this.props.startReleaseName, this.props.endReleaseName)
            .then(data =>
            {
                if (!this.m_isMounted)
                    return;

                const filterKey = `${this.props.startReleaseName}-${this.props.endReleaseName}`;
                this.state.createdFilters[filterKey] =
                {
                    createdFilterName: data.name,
                    createdFilterUrl: data.url
                };
                this.state.isCreatingFilter = false;

                this.forceUpdate();
            })
            .catch(error =>
            {
                if (!this.m_isMounted)
                    return;

                ErrorHandler.showErrorMessage(error);

                this.setState(
                {
                    isCreatingFilter: false
                });
            });
    }

    render()
    {
        if (this.canCreateReleaseFilter())
        {
            const createdFilter = this.getCreatedFilter();

            if (createdFilter)
            {
                return <p className="ticket-list-action">Created JIRA filter: <a href={createdFilter.createdFilterUrl} target="_blank" rel="external">{createdFilter.createdFilterName}</a></p>;
            }
            else
            {
                return (
                    <div className="ticket-list-action">
                        <RaisedButton
                            icon={<IconReleaseFilter />}
                            label="Create release filter"
                            onTouchTap={this.handleCreateReleaseFilterClick.bind(this)}
                            secondary={true} />
                        {
                            (() =>
                            {
                                if (this.state.isCreatingFilter)
                                {
                                    return <LinearProgress mode="indeterminate" />
                                }
                            })()
                        }
                    </div>
                );
            }
        }

        return null;
    }
}