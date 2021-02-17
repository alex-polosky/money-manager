import React, { ReactNode } from "react";
import { DateRangeFilter, FilterableState } from "../filters";
import { RenderDate } from "../helper";
import { Manager } from "../Manager";
import { Account } from "../models/Account";
import { Category } from "../models/Category";
import { PostType, Transaction } from "../models/Transaction";

interface TransactionsViewParams {
    manager: Manager;
}
interface TransactionsViewState extends FilterableState<Transaction> {
}

class Test extends React.Component<{ objects: Transaction[] }, {}> {
    public render(): ReactNode {
        return (<tbody>
            {this.props.objects.map((value, index) =>
                <tr key={index}>
                    <td>{RenderDate(value.posted)}</td>
                    <td>{(value.account as Account)?.name_friendly}</td>
                    <td>{value.description}</td>
                    {/* <td>{value.description_from_source}</td> */}
                    <td>{value.post_type === PostType.DEBIT ? '- ' : ''}{value.amount}</td>
                    <td>{(value.category as Category).name}</td>
                </tr>
            )}
        </tbody>);
    }
}

class TransactionsView extends React.Component<TransactionsViewParams, TransactionsViewState> {

    constructor(props: TransactionsViewParams) {
        super(props);
        this.state = {
            objects: [],
            filteredObjects: [],
            filters: []
        };
    }

    public componentDidMount(): void {
        if (this.props.manager.isInitialized) {
            this.setState((state) => FilterableState.generateStateWithFilters({
                ...state,
                objects: [...this.props.manager.transactions]
            }, []));
        } else {
            this.props.manager.addInitializeEventHandler(() => {
                this.setState((state) => FilterableState.generateStateWithFilters({
                    ...state,
                    objects: [...this.props.manager.transactions]
                }, []));
            });
        }
    }

    public render(): ReactNode {
        return (
        <div>
            <div>
                <button onClick={() => this._toggleMonth()}>Toggle Feb month</button>
            </div>
            <table>
                <thead>
                    <tr>
                        <th>Posted</th>
                        <th>Account</th>
                        <th>Description</th>
                        {/* <th>OG Description</th> */}
                        <th>Amount</th>
                        <th>Category</th>
                    </tr>
                </thead>
                {<Test objects={this.state.filteredObjects} />}
                {/* <tbody>
                    {this.state.filteredObjects.map((value, index) =>
                        <tr key={index}>
                            <td>{RenderDate(value.posted)}</td>
                            <td>{(value.account as Account)?.name_friendly}</td>
                            <td>{value.description}</td>
                            <td>{value.post_type === PostType.DEBIT ? '- ' : ''}{value.amount}</td>
                            <td>{(value.category as Category).name}</td>
                        </tr>
                    )}
                </tbody> */}
            </table>
        </div>
        );
    }

    private _toggleMonth(): void {
        if (this.state.filters.length === 0) {
            this.setState((state) => FilterableState.generateStateWithFilters(state, [new DateRangeFilter<Transaction>(new Date(2021, 1, 1))]));
        } else {
            this.setState((state) => FilterableState.generateStateWithFilters(state));
        }
    }
}

export default TransactionsView;