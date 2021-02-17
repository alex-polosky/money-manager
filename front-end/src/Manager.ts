import { v4 as uuid } from 'uuid';
import { Api } from "./api/api";
import { Account } from "./models/Account";
import { AccountCurrentValue } from "./models/AccountCurrentValue";
import { Category } from "./models/Category";
import { SubCategory } from "./models/SubCategory";
import { Transaction } from "./models/Transaction";

export class Manager {
    public accounts: Account[] = [];
    public accountCurrentValues: AccountCurrentValue[] = [];
    public categories: (Category | SubCategory)[] = [];
    public transactions: Transaction[] = [];

    private _accountMap = new Map<string, Account>();
    private _accountCurrentValueMap = new Map<string, AccountCurrentValue>();
    private _categoryMap = new Map<string, (Category | SubCategory)>();
    private _transactionMap = new Map<string, Transaction>();

    private __isInitialized: boolean = false;
    public get isInitialized(): boolean {
        return this.__isInitialized;
    }

    protected _api = new Api('http://localhost:8000');
    protected _handlers = new Map<string, Function>();

    // constructor() { }

    public async initialize(): Promise<void> {
        try {
            for (let each of await this._api.account.get()) {
                this.accounts.push(each);
                this._accountMap.set(each.id, each);
            }
            for (let each of await this._api.accountCurrentValue.get()) {
                each.posted = (each.posted as unknown as string) !== undefined ? new Date(each.posted) : each.posted;
                this.accountCurrentValues.push(each);
                this._accountCurrentValueMap.set(each.id, each);
            }
            for (let each of await this._api.category.get()) {
                this.categories.push(each);
                this._categoryMap.set(each.id, each);
            }
            for (let each of await this._api.subcategory.get()) {
                this.categories.push(each);
                this._categoryMap.set(each.id, each);
            }
            for (let each of await this._api.transaction.get()) {
                each.posted = (each.posted as unknown as string) !== undefined ? new Date(each.posted) : each.posted;
                this.transactions.push(each);
                this._transactionMap.set(each.id, each);
            }
            this._setmaps();
            this.__isInitialized = true;
            for (let f of this._handlers.values()) {
                f();
            }
            return Promise.resolve();
        }
        catch (reason: any) {
            console.log(reason);
            return Promise.reject(reason);
        }
    }

    public addInitializeEventHandler(handler: () => void): void {
        let key = uuid();
        this._handlers.set(key, () => {
            try {
                handler();
            }
            catch (reason: any) {
                // TODO: should probably provide a way out of this
            }
            this._handlers.delete(key);
        });
    }

    private _setmaps(): void {
        for (let each of this.accountCurrentValues) {
            each.account = this._accountMap.get(each.account as string) as Account;
        }
        for (let each of this.categories) {
            let subcat = each as SubCategory;
            if (subcat.category !== undefined)
                subcat.category = this._categoryMap.get(subcat.category as string) as Category;
        }
        for (let each of this.transactions) {
            each.account = this._accountMap.get(each.account as string) as Account;
            each.category = this._categoryMap.get(each.category as string) as Category;
        }
    }
}