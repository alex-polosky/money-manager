import { AccountCurrentValue } from "./AccountCurrentValue";

export enum AccountClassifier {
    NONE = 0,
    CASH = 1,
    CREDIT_CARD = 2,
    LOAN = 3,
    INVESTMENT = 4,
    VIRTUAL = 5
}

export interface Account {
    id: string; // TODO: guid
    origin_key?: string;
    classifier: AccountClassifier;
    name_transaction: string;
    provider: string;
    name_friendly: string;
    is_active: boolean;

    accountCurrentValues: AccountCurrentValue[];
}

export function isAccount(obj: any): obj is Account {
    if (obj === undefined || obj === null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && typeof obj['classifier'] === 'number'
        && typeof obj['name_transaction'] === 'string'
        && typeof obj['provider'] === 'string'
        && typeof obj['name_friendly'] === 'string'
        && typeof obj['is_active'] === 'boolean';
}