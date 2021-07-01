import React, { ReactNode } from "react";
import loading from "../components/loading";
import { Account, AccountClassifier } from "../models/money-details/Account";

interface AccountsViewProps {
    objects: Account[];
    isReady: boolean;
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
        const render = (
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

        return (this.props.isReady ? render : loading());
    }
}

export default AccountsView;