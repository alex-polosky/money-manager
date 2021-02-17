import React from 'react';
// import logo from './logo.svg';
import './App.css';
import AccountsView from './views/accounts';
import { Manager } from './Manager';
import TransactionsView from './views/transactions';

enum Page {
    HOME,
    ACCOUNT,
    TRANS
}

interface AppViewParams {
}
interface AppViewState {
    isReady: boolean;
    page: Page;
}

class App extends React.Component<AppViewParams, AppViewState> {
    private __manager = new Manager();

    constructor(props: AppViewParams) {
        super(props);
        this.state = {
            isReady: false,
            page: Page.HOME
        };
    }

    public componentDidMount(): void {
        this.__manager.initialize().then(
            () => {
                this.setState((state) => ({
                    ...state,
                    isReady: true
                }));
            }).catch((reason) => {
                console.log(reason);
                throw reason;
            });
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
                return (<AccountsView manager={this.__manager} />);
            case Page.TRANS:
                return (<TransactionsView manager={this.__manager} />);
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
                {this._renderHeader()}
                {this._renderPage()}
            </div>
        );
    }
}

export default App;
