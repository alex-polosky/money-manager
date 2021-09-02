import 'react-pivottable/pivottable.css';

import { Account, isAccount } from "../../models/money-details/Account";
import { Category, isCategory } from "../../models/money-details/Category";
import { PostType, Transaction } from "../../models/money-details/Transaction";
import React, { ReactNode } from "react";
import { SubCategory, isSubCategory } from "../../models/money-details/SubCategory";

import PivotTableUI from 'react-pivottable/PivotTableUI';
import Plot from 'react-plotly.js';
import TableRenderers from 'react-pivottable/TableRenderers';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import { renderUSADate } from "../../helper";

const PlotlyRenderers = createPlotlyRenderers(Plot.prototype);

interface Data {
    account: string,
    amount: number,
    post_type: 'Credit' | 'Debit',
    category: string,
    posted: string,
    year: number,
    month: number,
    day: number
}

interface TransactionPivotTableProps {
    objects: Transaction[];
}
interface TransactionPivotTableState {
    data: Data[]
}

export class TransactionPivotTable extends React.Component<TransactionPivotTableProps, TransactionPivotTableState> {
    constructor(props: Readonly<TransactionPivotTableProps>) {
        super(props);
        this.state = {
            data: this.generateData(props.objects)
        };
    }
    shouldComponentUpdate(nextProps: Readonly<TransactionPivotTableProps>, nextState: Readonly<TransactionPivotTableState>, nextContext: any): boolean {
        if (nextProps.objects.length !== nextState.data.length) {
            this.setState((state) => ({
                ...state,
                data: this.generateData(nextProps.objects)
            }));
        }
        return true;
    }
    public render(): ReactNode {
        // const data = [['attribute', 'attribute2'], ['value1', 'value2'], ['asdf', '234']];
        return (
        <div>
            <PivotTableUI
                {...this.state}
                data={this.state.data}
                onChange={(state) => this.setState(state)}
                // renderers={Object.assign({}, TableRenderers, PlotlyRenderers)}
            />
        </div>);
    }
    private generateData(data: Transaction[]): Data[] {
        return data.map((t) => ({
            account: isAccount(t.account) ? t.account.name_transaction : t.account,
            amount: t.post_type === PostType.CREDIT ? t.amount : (0 - t.amount),
            post_type: t.post_type === PostType.CREDIT ? 'Credit' : 'Debit',
            category: isSubCategory(t.category)
                ? (t.category.category as Category).name
                : isCategory(t.category)
                    ? t.category.name
                    : t.category,
            subCategory: isSubCategory(t.category)
                ? (t.category as SubCategory).name
                : null,
            posted: renderUSADate(t.posted),
            year: t.posted.getFullYear(),
            month: t.posted.getMonth() + 1,
            day: t.posted.getDate()
        }));
    }
}