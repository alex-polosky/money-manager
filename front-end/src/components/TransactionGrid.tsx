import React, { ReactNode } from "react";
import { renderShortDate } from "../helper";
import { Account, isAccount } from "../models/Account";
import { Category, isCategory } from "../models/Category";
import { isSubCategory } from "../models/SubCategory";
import { PostType, Transaction } from "../models/Transaction";

interface TransactionGridViewProps {
    objects: Transaction[];
}
interface TransactionGridViewState {
}

class TransactionGrid extends React.Component<TransactionGridViewProps, TransactionGridViewState> {
    public render(): ReactNode {
        return (
        <table>
            <thead>
                <tr>
                    <th>Posted</th>
                    <th>Account</th>
                    <th>Description</th>
                    <th>Amount</th>
                    <th>Category</th>
                    <th>SubCategory</th>
                </tr>
            </thead>
            <tbody>
                {this.props.objects.map((value, index) =>
                    <tr key={index}>
                        <td>{renderShortDate(value.posted)}</td>
                        <td>{isAccount(value.account) ? value.account.name_friendly : value.account}</td>
                        <td>{value.description}</td>
                        <td>{value.post_type === PostType.DEBIT ? '-' : ''}${value.amount.toFixed(2)}</td>
                        <td>{isSubCategory(value.category)
                            ? (value.category.category as Category).name
                            : isCategory(value.category)
                                ? value.category.name
                                : value.category}</td>
                        <td>{isSubCategory(value.category) ? value.category.name : ''}</td>
                    </tr>
                )}
            </tbody>
        </table>);
    }
}

export default TransactionGrid;