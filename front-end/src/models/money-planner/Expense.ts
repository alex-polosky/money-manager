import { Account, isAccount } from "./Account";

export interface Expense {
    id: string; // TODO: guid
    origin_key?: string;
    ref: string;
    value: number;
    day: number;
    pay_from?: string | Account; // TODO: guid | Account
    is_auto: boolean;
    comment: string;
}

export function isExpense(obj: any): obj is Expense {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && typeof obj['ref'] === 'string'
        && typeof obj['value'] === 'number'
        && typeof obj['day'] === 'number'
        && (obj['pay_from'] === undefined || obj['pay_from'] === null || typeof obj['pay_from'] === 'string' || isAccount(obj['pay_from']))
        && typeof obj['is_auto'] === 'boolean'
        && typeof obj['comment'] === 'string';
}