import React, { ReactNode } from "react";
import { useEffect } from "react";
import TransactionChart from "../components/TransactionChart";
import TransactionFilterHeader from "../components/TransactionFilterHeader";
import TransactionGrid from "../components/TransactionGrid";
import { TransactionPivotTable } from "../components/TransactionPivotTable";
import { MoneyDetailsController } from "../controllers/MoneyDetails";
import { Filter, FilterableProps, FilterableState } from "../filter";
import { ObjectKeyFilter } from "../filters";
import loading from "../components/loading";
import { Transaction } from "../models/money-details/Transaction";

interface TransactionsViewProps extends FilterableProps<Transaction> {
    controller: MoneyDetailsController;
    isReady: boolean;
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

        // useEffect(() => {
        //     this.state = {
        //         ...this.state,
        //         ...FilterableState.generateStateWithFilters(this.props, {filteredObjects: [], filters: []}, [...this.builtInFilters])
        //     };
        // }, [this.props.objects]);
    }

    componentWillReceiveProps(nextProps: Readonly<TransactionsViewProps>) {
        // Skipping usual check for objects
        this.setState((state) => ({
            ...state,
            ...FilterableState.generateStateWithFilters(nextProps, {filteredObjects: [], filters: []}, [...this.builtInFilters])
        }));
    }

    public render(): ReactNode {
        const render = (
        <div>
            <div>
                <TransactionFilterHeader filters={this.state.filters} addFilter={this._onAddFilter.bind(this)} removeFilter={this._onRemoveFilter.bind(this)} />
                {/* {this.state.viewPivot ? <TransactionPivotTable objects={this.state.filteredObjects} /> : ''} */}
                {/* {this.state.viewCharts ? <TransactionChart objects={this.state.filteredObjects} /> : ''} */}
                {this.state.viewGrid
                    ? <TransactionGrid
                        accounts={this.props.controller.accounts}
                        categories={this.props.controller.categories}
                        objects={this.state.filteredObjects}
                    />
                    : ''}
            </div>
        </div>
        );

        return (this.props.isReady ? render : loading());
    }

    private _onAddFilter(filter: Filter<Transaction>): void {
        this.setState((state) => FilterableState.generateStateWithFilters(this.props, state, [...this.state.filters, filter]));
    }

    private _onRemoveFilter(filter: Filter<Transaction>): void {
        this.setState((state) => FilterableState.generateStateWithFilters(this.props, state, state.filters.filter((value) => value !== filter)));
    }
}

export default TransactionsView;