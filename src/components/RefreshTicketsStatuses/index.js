import BaseComponent from "../base-component";
import ErrorHandler from "../../handlers/error-handler";
import IconRefresh from "material-ui/svg-icons/navigation/refresh";
import LinearProgress from "material-ui/LinearProgress";
import RaisedButton from "material-ui/RaisedButton";
import { storiesRepository } from "../../repositories/stories-repository";

export default class RefreshTicketsStatuses extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            isRefreshing: false
        };
    }

    handleRefreshStatusesClick()
    {
        this.setState(
        {
            isRefreshing: true
        });
        
        storiesRepository.refreshStoriesStatuses()
            .then(() =>
            {
                if (!this.m_isMounted)
                    return;

                this.setState(
                {
                    isRefreshing: false
                });
            })
            .catch(error =>
            {
                if (!this.m_isMounted)
                    return;

                ErrorHandler.showErrorMessage(error);

                this.setState(
                {
                    isRefreshing: false
                });
            });
    }

    render()
    {
        return (
            <div className="ticket-list-action">
                <RaisedButton
                    icon={<IconRefresh />}
                    label="Refresh statuses"
                    onTouchTap={this.handleRefreshStatusesClick.bind(this)}
                    secondary={true} />
                {
                    (() =>
                    {
                        if (this.state.isRefreshing)
                        {
                            return <LinearProgress mode="indeterminate" />
                        }
                    })()
                }
            </div>
        );
    }
}