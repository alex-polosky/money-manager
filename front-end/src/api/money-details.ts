import * as MoneyDetails from '../models/money-details/models';

import { AbstractPagedApi, BaseApi } from "./api";

import { AxiosInstance } from 'axios';

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

export default class MoneyDetailsApi extends BaseApi {
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
