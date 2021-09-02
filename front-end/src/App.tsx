import './App.css';

import AccountsView from './views/money-details/accounts';
import { Button } from 'antd';
import MoneyDetailsApi from './api/money-details';
import { MoneyDetailsController } from './controllers/MoneyDetails';
import MoneyPlannerApi from './api/money-planner';
import { MoneyPlannerController } from './controllers/MoneyPlanner';
import PlannerView from './views/money-planner/planner';
import React from 'react';
import TransactionsView from './views/money-details/transactions';

enum Page {
    HOME,
    ACCOUNT,
    TRANS,
    PLAN
}

interface AppViewProps {
}
interface AppViewState {
    controllers: {
        moneyDetails: MoneyDetailsController,
        moneyPlanner: MoneyPlannerController
    };
    page: Page;
}

class App extends React.Component<AppViewProps, AppViewState> {
    private static __apiUrl = 'http://localhost:8000';
    private _moneyDetailsApi = new MoneyDetailsApi(App.__apiUrl);
    private _moneyPlannerApi = new MoneyPlannerApi(App.__apiUrl);

    constructor(props: AppViewProps) {
        super(props);
        this.state = {
            controllers: {
                moneyDetails: new MoneyDetailsController(this._moneyDetailsApi),
                moneyPlanner: new MoneyPlannerController(this._moneyPlannerApi)
            },
            page: Page.HOME
        };
        (window as any).vmApp = this;
    }

    public componentDidMount(): void {
        this._loadData().catch((reason) => console.error(reason));
    }

    private async _loadData(): Promise<void> {
        try {
            await Promise.all([
                this._moneyDetailsApi.preAuthenticate(),
                this._moneyPlannerApi.preAuthenticate()
            ]);

            await Promise.all([
                this.state.controllers.moneyDetails.loadAll(() => {
                    this.setState(state => state);
                }, () => {
                    this.state.controllers.moneyDetails.map();
                    this.setState(state => state);
                }),
                this.state.controllers.moneyPlanner.loadAll(() => {
                    this.setState(state => state);
                }, () => {
                    this.state.controllers.moneyPlanner.map();
                    this.setState(state => state);
                })
            ]);
        }
        catch (reason: any) {
            console.log(reason);
            throw reason;
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
            <Button onClick={() => this._changePage(Page.HOME)}>Home</Button>
            <Button onClick={() => this._changePage(Page.ACCOUNT)}>MoneyDetails.Accounts</Button>
            <Button onClick={() => this._changePage(Page.TRANS)}>MoneyDetails.Transactions</Button>
            <Button onClick={() => this._changePage(Page.PLAN)}>Money Planner!</Button>
        </div>;
    }

    private _renderPage(): React.ReactNode {
        switch (this.state.page) {
            case Page.HOME:
                return (<div>PLACEHOLDER</div>);
            case Page.ACCOUNT:
                return (<AccountsView objects={this.state.controllers.moneyDetails.accounts} isReady={this.state.controllers.moneyDetails.accounts.isReady} />);
            case Page.TRANS:
                return (<TransactionsView controller={this.state.controllers.moneyDetails} objects={this.state.controllers.moneyDetails.transactions} isReady={this.state.controllers.moneyDetails.transactions.isReady} />);
            case Page.PLAN:
                return (<PlannerView controller={this.state.controllers.moneyPlanner} />);
        }
    }

    public render(): React.ReactNode {
        return (
            <div className="App">
                <div className="App-header">{this._renderHeader()}</div>
                {this._renderPage()}
            </div>
        );
    }
}

export default App;
