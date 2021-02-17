import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { Account } from '../models/Account';
import { AccountCurrentValue } from '../models/AccountCurrentValue';
import { Category } from '../models/Category';
import { SubCategory } from '../models/SubCategory';
import { Transaction } from '../models/Transaction';

/// api
export class Api {
    private __account: ApiAccount;
    public get account(): ApiAccount {
        return this.__account;
    }

    private __accountCurrentValue: ApiAccountCurrentValue;
    public get accountCurrentValue(): ApiAccountCurrentValue {
        return this.__accountCurrentValue;
    }

    private __category: ApiCategory;
    public get category(): ApiCategory {
        return this.__category;
    }

    private __subcategory: ApiSubCategory;
    public get subcategory(): ApiSubCategory {
        return this.__subcategory;
    }

    private __transaction: ApiTransaction;
    public get transaction(): ApiTransaction {
        return this.__transaction;
    }

    protected _api: AxiosInstance;

    private __auth: ApiAuth;
    private __authCallInProgress: boolean = false;

    constructor(baseUrl: string) {
        this._api = axios.create({
            baseURL: baseUrl
        });
        this.__auth = new ApiAuth(baseUrl);
        this._api.interceptors.request.use(this._request_add_header.bind(this));

        this.__account = new ApiAccount(this._api);
        this.__accountCurrentValue = new ApiAccountCurrentValue(this._api);
        this.__category = new ApiCategory(this._api);
        this.__subcategory = new ApiSubCategory(this._api);
        this.__transaction = new ApiTransaction(this._api);
    }

    protected _authenticate(force: boolean = false): Promise<void> {
        if (force || (!this.__authCallInProgress && this.__auth.token === '')) {
            this.__authCallInProgress = true;
            return this.__auth.authenticate()
                .then(() => {
                    return Promise.resolve();
                })
                .catch((reason) => {
                    console.log(reason);
                    return Promise.reject(reason);
                }).finally(() => {
                    this.__authCallInProgress = false;
                });
        }
        return Promise.resolve();
    }

    protected _request_add_header(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
        return this._authenticate()
            .then(() => {
                config.headers = {
                    ...(config.headers || {}),
                    'Authorization': `Token ${this.__auth.token}`
                };
                return Promise.resolve(config);
            })
            .catch((reason) => {
                console.log(reason);
                return Promise.reject(reason);
            });
    }
}

/// api-auth
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

    public authenticate(): Promise<void> {
        // TODO: load user/pass from somewhere useful
        return this._api.post('api-token-auth/', {
            username: 'admin',
            password: 'asdf1234'
        }).then((value: AxiosResponse<{token: string}>) => {
            this._token = value.data.token;
            return Promise.resolve();
        }).catch((reason: any) => {
            // TODO: better error handling
            console.log(reason);
            return Promise.reject(reason);
        });
    }
}

interface ApiPagedResponse<T> {
    count: number;
    next?: string;
    previous?: string;
    results: T[];
}

class AbstractPagedApi<T> {
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
                return Promise.reject(reason);
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
        return Promise.resolve(data);
    }
}

class ApiAccount extends AbstractPagedApi<Account> {
    constructor(api: AxiosInstance) {
        super(api, 'api/account/');
    }
}

class ApiAccountCurrentValue extends AbstractPagedApi<AccountCurrentValue> {
    constructor(api: AxiosInstance) {
        super(api, 'api/accountcurrentvalue/');
    }
}

class ApiCategory extends AbstractPagedApi<Category> {
    constructor(api: AxiosInstance) {
        super(api, 'api/category/');
    }
}

class ApiSubCategory extends AbstractPagedApi<SubCategory> {
    constructor(api: AxiosInstance) {
        super(api, 'api/subcategory/');
    }
}

class ApiTransaction extends AbstractPagedApi<Transaction> {
    constructor(api: AxiosInstance) {
        super(api, 'api/transaction/');
    }
}
