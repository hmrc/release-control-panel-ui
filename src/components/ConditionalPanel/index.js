import classNames from "classnames";
import BaseComponent from "../base-component";

export default class ConditionalPanel extends BaseComponent
{
    render()
    {
        let classes = classNames(
        {
            "conditional-panel": true,
            "show": !!this.props.show
        });

        return (
            <div className={classes} style={this.props.style}>
                {this.props.children}
            </div>
        );
    }
}