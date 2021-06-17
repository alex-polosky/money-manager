import React from 'react';
import { DateTime } from 'luxon';
import { Api } from './api/api';
// import logo from './logo.svg';
import './App.css';
import { Account } from './models/Account';
import { AccountCurrentValue } from './models/AccountCurrentValue';
import { Category } from './models/Category';
import { SubCategory } from './models/SubCategory';
import { Transaction } from './models/Transaction';
import AccountsView from './views/accounts';
import TransactionsView from './views/transactions';

enum Page {
    HOME,
    ACCOUNT,
    TRANS
}

interface AppViewProps {
}
interface AppViewState {
    accounts: Account[];
    accountCurrentValues: AccountCurrentValue[];
    categories: (Category | SubCategory)[];
    transactions: Transaction[];
    isReady: boolean;
    page: Page;
}

class App extends React.Component<AppViewProps, AppViewState> {
    protected _api = new Api('http://localhost:8000');
    private _accountMap = new Map<string, Account>();
    private _accountCurrentValueMap = new Map<string, AccountCurrentValue>();
    private _categoryMap = new Map<string, (Category | SubCategory)>();
    private _transactionMap = new Map<string, Transaction>();

    constructor(props: AppViewProps) {
        super(props);
        this.state = {
            accounts: [],
            accountCurrentValues: [],
            categories: [],
            transactions: [],
            isReady: false,
            page: Page.HOME
        };
        (window as any).vmApp = this;
    }

    public componentDidMount(): void {
        this._loadData().catch((reason) => console.error(reason));
    }

    private async _loadData(): Promise<void> {
        try {
            for (let each of await this._api.account.get()) {
                each.accountCurrentValues = [];
                this.setState((state) => ({
                    ...state,
                    accounts: [...state.accounts, each]
                }));
                this._accountMap.set(each.id, each);
            }
            for (let each of await this._api.accountCurrentValue.get()) {
                each.posted = (typeof each.posted === 'string') !== undefined ? DateTime.fromFormat(each.posted as unknown as string, 'yyyy-MM-dd').toJSDate() : each.posted;
                each.amount = parseInt((each.amount / 100).toFixed(0)) + parseInt((each.amount / 100).toFixed(2).split('.')[1]) / 100;
                this.setState((state) => ({
                    ...state,
                    accountCurrentValues: [...state.accountCurrentValues, each]
                }));
                this._accountCurrentValueMap.set(each.id, each);
            }
            for (let each of await this._api.category.get()) {
                this.setState((state) => ({
                    ...state,
                    categories: [...state.categories, each]
                }));
                this._categoryMap.set(each.id, each);
            }
            for (let each of await this._api.subcategory.get()) {
                this.setState((state) => ({
                    ...state,
                    categories: [...state.categories, each]
                }));
                this._categoryMap.set(each.id, each);
            }
            for (let each of await this._api.transaction.get()) {
                each.posted = (typeof each.posted === 'string') !== undefined ? DateTime.fromFormat(each.posted as unknown as string, 'yyyy-MM-dd').toJSDate() : each.posted;
                each.amount = parseInt((each.amount / 100).toFixed(0)) + parseInt((each.amount / 100).toFixed(2).split('.')[1]) / 100;
                this.setState((state) => ({
                    ...state,
                    transactions: [...state.transactions, each]
                }));
                this._transactionMap.set(each.id, each);
            }
            // Set Maps
            for (let each of this.state.accountCurrentValues) {
                each.account = this._accountMap.get(each.account as string) as Account;
                each.account.accountCurrentValues.push(each);
            }
            for (let each of this.state.categories) {
                let subcat = each as SubCategory;
                if (subcat.category !== undefined)
                    subcat.category = this._categoryMap.get(subcat.category as string) as Category;
            }
            for (let each of this.state.transactions) {
                each.account = this._accountMap.get(each.account as string) as Account;
                each.category = this._categoryMap.get(each.category as string) as Category;
            }
            this.setState((state) => ({
                ...state,
                isReady: true
            }));
            return Promise.resolve();
        }
        catch (reason: any) {
            console.log(reason);
            return Promise.reject(reason);
        }
    }

    private _changePage(page: Page): void {
        this.setState((state) => ({
            ...state,
            page: page
        }));
    }

    private _renderHeader(): React.ReactNode {
        return <div>
            <button onClick={() => this._changePage(Page.HOME)}>Home</button>
            <button onClick={() => this._changePage(Page.ACCOUNT)}>Accounts</button>
            <button onClick={() => this._changePage(Page.TRANS)}>Transactions</button>
        </div>;
    }

    private _renderPage(): React.ReactNode {
        switch (this.state.page) {
            case Page.HOME:
                return (<div>PLACEHOLDER</div>);
            case Page.ACCOUNT:
                return (<AccountsView objects={this.state.accounts} />);
            case Page.TRANS:
                return (<TransactionsView objects={this.state.transactions} />);
        }
    }

    public render(): React.ReactNode {
        // const header = (
        //     <header className="App-header">
        //         <p>Loading</p>
        //         <img src={logo} className="App-logo" alt="logo" />
        //     </header>
        // );
        return (
            <div className="App">
                <div className="App-header">{this._renderHeader()}</div>
                {this._renderPage()}
            </div>
        );
    }
}

export default App;
