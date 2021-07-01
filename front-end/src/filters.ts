import { Filter } from "./filter";
import { isDateBetween, renderShortDate } from "./helper";
import { Account, isAccount } from "./models/money-details/Account";

export class AccountFilter<T extends { account: Account | string }> implements Filter<T> {
    accountId: string; // TODO: Guid
    public constructor(id: Account | string) {
        if (isAccount(id)) {
            this.accountId = id.id;
        } else {
            this.accountId = id;
        }
    }
    public filter(value: T): boolean {
        return this.accountId === (isAccount(value.account) ? value.account.id : value.account);
    }
}

export class ObjectKeyFilter<T extends { [key: string]: any }> implements Filter<T> {
    private key: string[];
    private value: any;
    private invert: boolean;
    private compareFn?: (value: T) => boolean;
    public constructor(key: string[] | string, value: any, invert: boolean = false, compareFn?: (value: T) => boolean) {
        if (typeof key === 'string') {
            this.key = [key];
        } else {
            this.key = key;
        }
        this.value = value;
        this.invert = invert;
        this.compareFn = compareFn;
    }
    public filter(value: T): boolean {
        if (this.compareFn !== undefined) {
            return this.compareFn(value);
        }
        let obj = value;
        for (let key of this.key) {
            if (typeof obj === 'object' && key in obj) {
                obj = obj[key];
            } else {
                break;
            }
        }
        if (this.invert) {
            return obj !== this.value;
        }
        return obj === this.value;
    }
    public toString(): string {
        return `${this.key}${this.invert ? '!' : '='}=${this.value}`;
    }
}

export class DateRangeFilter<T extends { posted: Date }> implements Filter<T> {
    from?: Date;
    to?: Date;
    public constructor(from?: Date, to?: Date) {
        this.from = from;
        this.to = to;
    }
    public filter(value: T): boolean {
        return isDateBetween(value.posted, this.from, this.to);
    }
    public toString(): string {
        return (this.from !== undefined ? renderShortDate(this.from) : 'inf') + ' to ' + (this.to !== undefined ? renderShortDate(this.to) : 'inf');
    }
}