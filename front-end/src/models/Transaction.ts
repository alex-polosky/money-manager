import { Account } from "./Account";
import { Category } from "./Category";
import { SubCategory } from "./SubCategory";

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