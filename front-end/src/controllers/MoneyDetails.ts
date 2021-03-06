import * as MoneyDetails from '../models/money-details/models';

import { ArrayApiLoader, ArrayApiLoaderMulti } from '../arrayLoader';
import { dton, ensureDate } from '../helper';

import MoneyDetailsApi from '../api/money-details';

export class MoneyDetailsController {
    public readonly accounts: ArrayApiLoader<MoneyDetails.Account>;
    public readonly accountCurrentValues: ArrayApiLoader<MoneyDetails.AccountCurrentValue>;
    public readonly transactions: ArrayApiLoader<MoneyDetails.Transaction>;
    public readonly categories: ArrayApiLoaderMulti<MoneyDetails.Category>;

    constructor(api: MoneyDetailsApi) {
        this.accounts = new ArrayApiLoader(api.account, async (each) => {
            each.accountCurrentValues = [];
        });
        this.accountCurrentValues = new ArrayApiLoader(api.accountCurrentValue, (each) => {
            each.posted = ensureDate(each.posted);
            each.amount = dton(each.amount);
        });
        this.transactions = new ArrayApiLoader(api.transaction, (each) => {
            each.posted = ensureDate(each.posted);
            each.amount = dton(each.amount);
        });
        this.categories = new ArrayApiLoaderMulti(undefined, api.category, api.subcategory);
    }

    public loadAll(afterEachLoad?: () => void, afterAllLoad?: () => void) {
        return Promise.all([
            this.accounts.load(() => afterEachLoad?.()),
            this.accountCurrentValues.load(() => afterEachLoad?.()),
            this.categories.load(() => afterEachLoad?.()),
            this.transactions.load(() => afterEachLoad?.())
        ]).then(() => {
            afterAllLoad?.();
            afterEachLoad?.();
        });
    }

    public map(): void {
        var accountMap = new Map(this.accounts.map(x => [x.id, x]));
        var categoryMap = new Map(this.categories.map(x => [x.id, x]));

        for (let each of this.accountCurrentValues) {
            each.account = accountMap.get(each.account as string) as MoneyDetails.Account;
            each.account.accountCurrentValues.push(each);
        }
        for (let each of this.categories) {
            let subcat = each as MoneyDetails.SubCategory;
            if (subcat.category !== undefined)
                subcat.category = categoryMap.get(subcat.category as string) as MoneyDetails.Category;
        }
        for (let each of this.transactions) {
            each.account = accountMap.get(each.account as string) as MoneyDetails.Account;
            each.category = categoryMap.get(each.category as string) as MoneyDetails.Category;
        }
    }
}