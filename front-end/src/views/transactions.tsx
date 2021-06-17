import React, { ReactNode } from "react";
import TransactionChart from "../components/TransactionChart";
import TransactionFilterHeader from "../components/TransactionFilterHeader";
import TransactionGrid from "../components/TransactionGrid";
import { TransactionPivotTable } from "../components/TransactionPivotTable";
import { Filter, FilterableProps, FilterableState } from "../filter";
import { ObjectKeyFilter } from "../filters";
import { Transaction } from "../models/Transaction";

interface TransactionsViewProps extends FilterableProps<Transaction> {
}
interface TransactionsViewState extends FilterableState<Transaction> {
    viewGrid: boolean;
    viewCharts: boolean;
    viewPivot: boolean;
}

class TransactionsView extends React.Component<TransactionsViewProps, TransactionsViewState> {
    public readonly builtInFilters = [
        new ObjectKeyFilter<Transaction>(['category', 'name'], 'Transfer', true),
        new ObjectKeyFilter<Transaction>(['category', 'category', 'name'], 'Transfer', true),
        new ObjectKeyFilter<Transaction>(['category', 'name'], 'Hide from Budgets & Trends', true),
        new ObjectKeyFilter<Transaction>(['category', 'category', 'name'], 'Hide from Budgets & Trends', true)
    ];

    constructor(props: TransactionsViewProps) {
        super(props);
        this.state = {
            ...FilterableState.generateStateWithFilters(this.props, {filteredObjects: [], filters: []}, [...this.builtInFilters]),
            viewGrid: true,
            viewCharts: true,
            viewPivot: true
        };
    }

    public render(): ReactNode {
        return (
        <div>
            <div>
                <TransactionFilterHeader filters={this.state.filters} addFilter={this._onAddFilter.bind(this)} removeFilter={this._onRemoveFilter.bind(this)} />
                {this.state.viewPivot ? <TransactionPivotTable objects={this.state.filteredObjects} /> : ''}
                {this.state.viewCharts ? <TransactionChart objects={this.state.filteredObjects} /> : ''}
                {this.state.viewGrid ? <TransactionGrid objects={this.state.filteredObjects} /> : ''}
            </div>
        </div>
        );
    }

    private _onAddFilter(filter: Filter<Transaction>): void {
        this.setState((state) => FilterableState.generateStateWithFilters(this.props, state, [...this.state.filters, filter]));
    }

    private _onRemoveFilter(filter: Filter<Transaction>): void {
        this.setState((state) => FilterableState.generateStateWithFilters(this.props, state, state.filters.filter((value) => value !== filter)));
    }
}

export default TransactionsView;