import React, { ReactNode } from "react";
import { Manager } from "../Manager";
import { Account, AccountClassifier } from "../models/Account";

interface AccountsViewParams {
    manager: Manager;
}
interface AccountsViewState {
    accounts: Account[];
}

class AccountsView extends React.Component<AccountsViewParams, AccountsViewState> {

    constructor(props: AccountsViewParams) {
        super(props);
        this.state = {
            accounts: []
        };
    }

    public componentDidMount(): void {
        if (this.props.manager.isInitialized) {
            this.setState({
                accounts: this.props.manager.accounts
            });
        } else {
            this.props.manager.addInitializeEventHandler(() => {
                this.setState({
                    accounts: this.props.manager.accounts
                });
            });
        }
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
                {this.state.accounts.map((value, index, array) =>
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