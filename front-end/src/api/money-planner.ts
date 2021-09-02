import * as MoneyPlanner from '../models/money-planner/models';

import { AbstractPagedApi, BaseApi } from "./api";

import { AxiosInstance } from "axios";

class MoneyPlannerApiAccount extends AbstractPagedApi<MoneyPlanner.Account> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/account/');
    }
}

class MoneyPlannerApiIncome extends AbstractPagedApi<MoneyPlanner.Income> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/income/');
    }
}

class MoneyPlannerApiTransfer extends AbstractPagedApi<MoneyPlanner.Transfer> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/transfer/');
    }
}

class MoneyPlannerApiExpense extends AbstractPagedApi<MoneyPlanner.Expense> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/expense/');
    }
}

class MoneyPlannerApiTemplate extends AbstractPagedApi<MoneyPlanner.Template> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/template/');
    }
}

class MoneyPlannerApiTemplateAccount extends AbstractPagedApi<MoneyPlanner.TemplateAccount> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/templateaccount/');
    }
}

class MoneyPlannerApiTemplateIncome extends AbstractPagedApi<MoneyPlanner.TemplateIncome> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/templateincome/');
    }
}

class MoneyPlannerApiTemplateTransfer extends AbstractPagedApi<MoneyPlanner.TemplateTransfer> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/templatetransfer/');
    }
}

class MoneyPlannerApiTemplateExpense extends AbstractPagedApi<MoneyPlanner.TemplateExpense> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/templateexpense/');
    }
}

class MoneyPlannerApiInstance extends AbstractPagedApi<MoneyPlanner.Instance> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/instance/');
    }
}

class MoneyPlannerApiInstanceAccount extends AbstractPagedApi<MoneyPlanner.InstanceAccount> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/instanceaccount/');
    }
}

class MoneyPlannerApiInstanceIncome extends AbstractPagedApi<MoneyPlanner.InstanceIncome> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/instanceincome/');
    }
}

class MoneyPlannerApiInstanceTransfer extends AbstractPagedApi<MoneyPlanner.InstanceTransfer> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/instancetransfer/');
    }
}

class MoneyPlannerApiInstanceExpense extends AbstractPagedApi<MoneyPlanner.InstanceExpense> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-planner/instanceexpense/');
    }
}

export default class MoneyPlannerApi extends BaseApi {
    private __account: MoneyPlannerApiAccount;
    public get account(): MoneyPlannerApiAccount {
        return this.__account;
    }

    private __expense: MoneyPlannerApiExpense;
    public get expense(): MoneyPlannerApiExpense {
        return this.__expense;
    }

    private __income: MoneyPlannerApiIncome;
    public get income(): MoneyPlannerApiIncome {
        return this.__income;
    }

    private __instance: MoneyPlannerApiInstance;
    public get instance(): MoneyPlannerApiInstance {
        return this.__instance;
    }

    private __instanceaccount: MoneyPlannerApiInstanceAccount;
    public get instanceaccount(): MoneyPlannerApiInstanceAccount {
        return this.__instanceaccount;
    }

    private __instanceexpense: MoneyPlannerApiInstanceExpense;
    public get instanceexpense(): MoneyPlannerApiInstanceExpense {
        return this.__instanceexpense;
    }

    private __instanceincome: MoneyPlannerApiInstanceIncome;
    public get instanceincome(): MoneyPlannerApiInstanceIncome {
        return this.__instanceincome;
    }

    private __instancetransfer: MoneyPlannerApiInstanceTransfer;
    public get instancetransfer(): MoneyPlannerApiInstanceTransfer {
        return this.__instancetransfer;
    }

    private __template: MoneyPlannerApiTemplate;
    public get template(): MoneyPlannerApiTemplate {
        return this.__template;
    }

    private __templateaccount: MoneyPlannerApiTemplateAccount;
    public get templateaccount(): MoneyPlannerApiTemplateAccount {
        return this.__templateaccount;
    }

    private __templateexpense: MoneyPlannerApiTemplateExpense;
    public get templateexpense(): MoneyPlannerApiTemplateExpense {
        return this.__templateexpense;
    }

    private __templateincome: MoneyPlannerApiTemplateIncome;
    public get templateincome(): MoneyPlannerApiTemplateIncome {
        return this.__templateincome;
    }

    private __templatetransfer: MoneyPlannerApiTemplateTransfer;
    public get templatetransfer(): MoneyPlannerApiTemplateTransfer {
        return this.__templatetransfer;
    }

    private __transfer: MoneyPlannerApiTransfer;
    public get transfer(): MoneyPlannerApiTransfer {
        return this.__transfer;
    }

    constructor(baseUrl: string) {
        super(baseUrl);

        this.__account = new MoneyPlannerApiAccount(this._api);
        this.__expense = new MoneyPlannerApiExpense(this._api);
        this.__income = new MoneyPlannerApiIncome(this._api);
        this.__instance = new MoneyPlannerApiInstance(this._api);
        this.__instanceaccount = new MoneyPlannerApiInstanceAccount(this._api);
        this.__instanceexpense = new MoneyPlannerApiInstanceExpense(this._api);
        this.__instanceincome = new MoneyPlannerApiInstanceIncome(this._api);
        this.__instancetransfer = new MoneyPlannerApiInstanceTransfer(this._api);
        this.__template = new MoneyPlannerApiTemplate(this._api);
        this.__templateaccount = new MoneyPlannerApiTemplateAccount(this._api);
        this.__templateexpense = new MoneyPlannerApiTemplateExpense(this._api);
        this.__templateincome = new MoneyPlannerApiTemplateIncome(this._api);
        this.__templatetransfer = new MoneyPlannerApiTemplateTransfer(this._api);
        this.__transfer = new MoneyPlannerApiTransfer(this._api);
    }
}
