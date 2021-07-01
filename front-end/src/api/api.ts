import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import * as MoneyDetails from '../models/money-details/models';
import * as MoneyPlanner from '../models/money-planner/models';

//#region api scaffolding to inherit

abstract class BaseApi {
    protected _api: AxiosInstance;

    private __auth: ApiAuth;
    private __authCallInProgress: boolean = false;

    constructor(baseUrl: string) {
        this._api = axios.create({
            baseURL: baseUrl
        });
        this.__auth = new ApiAuth(baseUrl);
        this._api.interceptors.request.use(this._request_add_header.bind(this));
    }

    public async preAuthenticate(): Promise<void> {
        await this._authenticate();
    }

    protected _authenticate(): Promise<void> {
        // This cannot be converted to use async / await as we need to use setTimeout
        return new Promise((resolve, reject) => {
            if (this.__authCallInProgress) {
                setTimeout(() => 
                    this._authenticate()
                        .then(() => resolve())
                        .catch((reason) => reject(reason))
                , 500);
            }
            if (this.__auth.token === '') {
                this.__authCallInProgress = true;
                this.__auth.authenticate()
                    .then(() => resolve())
                    .catch((reason) => reject(reason))
                    .finally(() => this.__authCallInProgress = false);
            }
            else {
                resolve();
            }
        });
    }

    protected async _request_add_header(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        await this._authenticate();
        return {
            ...config,
            headers: {
                ...config.headers,
                'Authorization': `Token ${this.__auth.token}`
            }
        };
    }
}

class ApiAuth {
    protected _api: AxiosInstance;
    protected _token: string = '';

    public get token(): string {
        return this._token;
    }

    constructor(baseUrl: string) {
        this._api = axios.create({
            baseURL: baseUrl
        });
        // this._api.interceptors.request.use(
        //     (config: AxiosRequestConfig) => {
        //         return config;
        //     }, (reason: any) => {
        //         return Promise.reject(reason);
        //     }
        // );
        // this._api.interceptors.response.use(
        //     (response: AxiosResponse<any>) => {
        //         return response;
        //     }, (reason: any) => {
        //         return Promise.reject(reason);
        //     }
        // );
    }

    public async authenticate(): Promise<void> {
        // TODO: load user/pass from somewhere useful
        var response: AxiosResponse<{token: string}> = await this._api.post('api-token-auth/', {
            username: 'admin',
            password: 'asdf1234'
        });
        this._token = response.data.token;
    }
}

interface ApiPagedResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
}

export class AbstractPagedApi<T> {
    protected _api: AxiosInstance;
    protected _root: string;
    constructor(api: AxiosInstance, root: string) {
        this._api = api;
        this._root = root;
    }

    public async get(): Promise<T[]> {
        let data: T[] = [];
        let nextPage: string | null = '1';
        while (nextPage !== null) {
            let response: AxiosResponse<ApiPagedResponse<T>>;
            try {
                response = await this._api.get(`${this._root}?page=${nextPage}`);
            } catch (reason: any) {
                // TODO: better error handling
                console.log(reason);
                throw reason;
            }
            for (let result of response.data.results) {
                data.push(result);
            }
            if (response.data.next) {
                nextPage = response.data.next.split('page=')[1].split('&')[0];
            } else {
                nextPage = null;
            }
        }
        return data;
    }
}

//#endregion api scaffolding to inherit

//#region MoneyDetails

class MoneyDetailsApiAccount extends AbstractPagedApi<MoneyDetails.Account> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-details/account/');
    }
}

class MoneyDetailsApiAccountCurrentValue extends AbstractPagedApi<MoneyDetails.AccountCurrentValue> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-details/accountcurrentvalue/');
    }
}

class MoneyDetailsApiCategory extends AbstractPagedApi<MoneyDetails.Category> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-details/category/');
    }
}

class MoneyDetailsApiSubCategory extends AbstractPagedApi<MoneyDetails.SubCategory> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-details/subcategory/');
    }
}

class MoneyDetailsApiTransaction extends AbstractPagedApi<MoneyDetails.Transaction> {
    constructor(api: AxiosInstance) {
        super(api, 'api/money-details/transaction/');
    }
}

class MoneyDetailsApi extends BaseApi {
    private __account: MoneyDetailsApiAccount;
    public get account(): MoneyDetailsApiAccount {
        return this.__account;
    }

    private __accountCurrentValue: MoneyDetailsApiAccountCurrentValue;
    public get accountCurrentValue(): MoneyDetailsApiAccountCurrentValue {
        return this.__accountCurrentValue;
    }

    private __category: MoneyDetailsApiCategory;
    public get category(): MoneyDetailsApiCategory {
        return this.__category;
    }

    private __subcategory: MoneyDetailsApiSubCategory;
    public get subcategory(): MoneyDetailsApiSubCategory {
        return this.__subcategory;
    }

    private __transaction: MoneyDetailsApiTransaction;
    public get transaction(): MoneyDetailsApiTransaction {
        return this.__transaction;
    }

    constructor(baseUrl: string) {
        super(baseUrl);

        this.__account = new MoneyDetailsApiAccount(this._api);
        this.__accountCurrentValue = new MoneyDetailsApiAccountCurrentValue(this._api);
        this.__category = new MoneyDetailsApiCategory(this._api);
        this.__subcategory = new MoneyDetailsApiSubCategory(this._api);
        this.__transaction = new MoneyDetailsApiTransaction(this._api);
    }
}

//#endregion MoneyDetails

//#region MoneyPlanner

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

class MoneyPlannerApi extends BaseApi {
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

//#endregion MoneyPlanner

export class Api {
    private __moneyDetails: MoneyDetailsApi;
    public get moneyDetails(): MoneyDetailsApi {
        return this.__moneyDetails;
    }

    private __moneyPlanner: MoneyPlannerApi;
    public get moneyPlanner(): MoneyPlannerApi {
        return this.__moneyPlanner;
    }

    constructor(baseUrl: string) {
        this.__moneyDetails = new MoneyDetailsApi(baseUrl);
        this.__moneyPlanner = new MoneyPlannerApi(baseUrl);
    }
}
