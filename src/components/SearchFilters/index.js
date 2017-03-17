import BaseComponent from "../base-component";
import Checkbox from "material-ui/Checkbox";
import ConditionalPanel from "../ConditionalPanel";
import Events from "../../models/events";
import { globalEventEmitter } from "../../utils/global-event-emitter";
import SearchFlags from "../../models/search-flags";
import Settings from "../../utils/settings";
import Subheader from "material-ui/Subheader";
import Toggle from "material-ui/Toggle";

export default class SearchFilters extends BaseComponent
{
    constructor(props)
    {
        super(props);

        this.state =
        {
            searchFlags: Settings.getSearchFlags(),
            showFilters: false
        };
    }

    handleFilterChange(filter)
    {
        let valueToSet = this.state.searchFlags;

        if (filter === SearchFlags.ShowAll)
        {
            valueToSet &= (~SearchFlags.HideCompletedReleases) & (~SearchFlags.HideResolvedTasks);
        }
        else
        {
            valueToSet ^= filter;
        }

        this.setState(
        {
            searchFlags: valueToSet
        });

        Settings.saveSearchFlags(valueToSet);
        globalEventEmitter.emit(Events.SEARCH_FLAGS_CHANGED, valueToSet);
    }

    handleShowFiltersChange()
    {
        this.setState(
        {
            showFilters: !this.state.showFilters
        });
    }

    isFilterChecked(flags)
    {
        let active = false;
        let searchFlags = this.state.searchFlags;

        if (flags === SearchFlags.ShowAll)
        {
            active = !(searchFlags & (SearchFlags.HideCompletedReleases | SearchFlags.HideResolvedTasks));
        }
        else
        {
            active = !!(searchFlags & flags);
        }

        return active;
    }

    render()
    {
        return (
            <div>
                <Toggle
                    label="Show filters"
                    labelPosition="right"
                    onToggle={this.handleShowFiltersChange.bind(this)}
                    toggled={this.state.showFilters}
                />

                <ConditionalPanel show={this.state.showFilters}>
                    <Subheader>Filters</Subheader>
                    <Checkbox
                        checked={this.isFilterChecked(SearchFlags.ShowAll)}
                        label="Show all"
                        onCheck={this.handleFilterChange.bind(this, SearchFlags.ShowAll)} />
                    <Checkbox
                        checked={this.isFilterChecked(SearchFlags.HideCompletedReleases)}
                        label="Hide completed releases"
                        onCheck={this.handleFilterChange.bind(this, SearchFlags.HideCompletedReleases)} />
                    <Checkbox
                        checked={this.isFilterChecked(SearchFlags.HideResolvedTasks)}
                        label="Hide resolved tasks"
                        onCheck={this.handleFilterChange.bind(this, SearchFlags.HideResolvedTasks)} />
                    <Checkbox
                        checked={this.isFilterChecked(SearchFlags.CombineTasks)}
                        label="Combine tasks"
                        onCheck={this.handleFilterChange.bind(this, SearchFlags.CombineTasks)} />
                </ConditionalPanel>
            </div>
        );
    }
}