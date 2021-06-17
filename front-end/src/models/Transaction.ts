import { Account, isAccount } from "./Account";
import { Category, isCategory } from "./Category";
import { isSubCategory, SubCategory } from "./SubCategory";

export enum PostType {
    NONE = 0,
    DEBIT = 1,
    CREDIT = 2
}

export interface Transaction {
    id: string; // TODO: guid
    posted: Date;
    description: string;
    description_from_source: string;
    amount: number; // TODO: money
    post_type: PostType;
    notes?: string;
    account: Account | string;
    category: Category | SubCategory | string;
}

export function isTransaction(obj: any): obj is Transaction {
    if (obj === undefined || obj === null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && obj['posted'] instanceof Date
        && typeof obj['description'] === 'string'
        && typeof obj['description_from_source'] === 'string'
        && typeof obj['amount'] === 'number'
        && typeof obj['post_type'] === 'number'
        && (typeof obj['notes'] === 'string' || typeof obj['notes'] === undefined)
        && (typeof obj['account'] === 'string' || isAccount(obj['account']))
        && (typeof obj['category'] === 'string' || isCategory(obj['category']) || isSubCategory(obj['category']));
}