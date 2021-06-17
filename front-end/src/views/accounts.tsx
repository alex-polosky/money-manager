import React, { ReactNode } from "react";
import { Account, AccountClassifier } from "../models/Account";

interface AccountsViewProps {
    objects: Account[];
}
interface AccountsViewState {
}

class AccountsView extends React.Component<AccountsViewProps, AccountsViewState> {

    // constructor(props: AccountsViewProps) {
    //     super(props);
    // }

    public componentDidMount(): void {
    }

    public render(): ReactNode {
        return (
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Classifier</th>
                    <th>Name in Transactions</th>
                    <th>Provider</th>
                    <th>Name</th>
                    <th>Is Active</th>
                </tr>
            </thead>
            <tbody>
                {this.props.objects.map((value, index, array) =>
                    <tr key={index}>
                        <td>{value.id}</td>
                        <td>{AccountClassifier[value.classifier]}</td>
                        <td>{value.name_transaction}</td>
                        <td>{value.provider}</td>
                        <td>{value.name_friendly}</td>
                        <td>{value.is_active ? 'yes' : 'no'}</td>
                    </tr>
                )}
            </tbody>
        </table>
        );
    }
}

export default AccountsView;