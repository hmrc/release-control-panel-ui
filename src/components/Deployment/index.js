import BaseComponent from "../base-component";
import { deploymentRepository } from "../../repositories/deployment-repository";
import ErrorHandler from "../../handlers/error-handler";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import IconDeploy from "material-ui/svg-icons/editor/publish";
import IconDeployQA from "material-ui/svg-icons/social/school";
import IconDeployStaging from "material-ui/svg-icons/social/public";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";
import Popover from "material-ui/Popover";
import RaisedButton from "material-ui/RaisedButton";

export default class SmallSpinner extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            open: false
        };
    }

    handleDeployToQAClick(event)
    {
        event.preventDefault();

        this.setState(
        {
            open: false
        });

        deploymentRepository.deployToQA(this.props.projectName, this.props.version)
            .then(() =>
            {
                globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", "Deployment to QA started.");
            })
            .catch(error =>
            {
                ErrorHandler.showErrorMessage(error);
            });
    }

    handleDeployToStagingClick(event)
    {
        event.preventDefault();

        this.setState(
        {
            open: false
        });

        deploymentRepository.deployToStaging(this.props.projectName, this.props.version)
            .then(() =>
            {
                globalEventEmitter.emit(Events.SHOW_NOTIFICATION, "success", "Deployment to staging started.");
            })
            .catch(error =>
            {
                ErrorHandler.showErrorMessage(error);
            });
    }

    handleDeployClick(event)
    {
        event.preventDefault();

        this.setState(
        {
            anchorEl: event.currentTarget,
            open: true
        });
    }

    handleRequestClose()
    {
        this.setState(
        {
            open: false
        });
    }

    render()
    {
        return (
            <div>
                <RaisedButton
                    icon={<IconDeploy />}
                    label="Deploy"
                    onTouchTap={this.handleDeployClick.bind(this)}
                    secondary={true} />
                <Popover
                    anchorEl={this.state.anchorEl}
                    anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                    targetOrigin={{horizontal: 'left', vertical: 'top'}}
                    open={this.state.open}
                    onRequestClose={this.handleRequestClose.bind(this)}>
                    <Menu>
                        <MenuItem
                            leftIcon={<IconDeployQA />}
                            primaryText="Deploy to QA"
                            onTouchTap={this.handleDeployToQAClick.bind(this)} />
                        <MenuItem
                            leftIcon={<IconDeployStaging />}
                            primaryText="Deploy to Staging"
                            onTouchTap={this.handleDeployToStagingClick.bind(this)} />
                    </Menu>
                </Popover>
            </div>
        );
    }
}