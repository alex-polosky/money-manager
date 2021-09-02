import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

//#region api scaffolding to inherit

export abstract class BaseApi {
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
