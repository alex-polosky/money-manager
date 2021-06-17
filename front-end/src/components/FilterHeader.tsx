import React, { ReactNode } from "react";
import { Filter } from "../filter";

interface FilterHeaderProps<T> {
    filters: Filter<T>[];
    addFilter: (filter: Filter<T>) => void;
    removeFilter: (filter: Filter<T>) => void;
}

interface FilterHeaderState {
}

class FilterHeader<T> extends React.Component<FilterHeaderProps<T>, FilterHeaderState> {
    public render(): ReactNode {
        return (
        <div>
            {this.renderAdditionalFilters()}
            {this.props.filters.map((filter, index) => (
                <button key={index} onClick={() => this.props.removeFilter(filter)}>Remove Filter ({filter.toString !== undefined ? filter.toString() : ''})</button>
            ))}
        </div>);
    }

    protected renderAdditionalFilters(): ReactNode {
        return (<div></div>);
    }
}

export default FilterHeader;