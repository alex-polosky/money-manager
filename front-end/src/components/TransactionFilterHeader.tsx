import { ReactNode } from "react";
import { DateRangeFilter, ObjectKeyFilter } from "../filters";
import { Transaction } from "../models/Transaction";
import FilterHeader from "./FilterHeader";

class TransactionFilterHeader extends FilterHeader<Transaction> {
    protected renderAdditionalFilters(): ReactNode {
        return (
        <div>
            <button onClick={() => this.props.addFilter(new DateRangeFilter<Transaction>(new Date(2021, 1, 1)))}>Add Feb Filter</button>
            <button onClick={() => this.props.addFilter(new DateRangeFilter<Transaction>(new Date(2021, 0, 1), new Date(2021, 0, 31)))}>Add Jan Filter</button>
            <button onClick={() => this.props.addFilter(new ObjectKeyFilter<Transaction>(['category', 'name'], 'Transfer'))}>Add </button>
        </div>);
    }
}

export default TransactionFilterHeader;