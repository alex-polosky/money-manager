import { Account, isAccount } from "./Account";

export interface AccountCurrentValue {
    id: string; // TODO: guid
    posted: Date;
    amount: number; // TODO: money
    account: Account | string;
}

export function isAccountCurrentValue(obj: any): obj is AccountCurrentValue {
    if (obj === undefined || obj === null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && obj['posted'] instanceof Date
        && typeof obj['amount'] === 'number'
        && (typeof obj['account'] === 'string' || isAccount(obj['account']));
}