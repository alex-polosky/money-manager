import { Account, isAccount } from "./Account";
import { Instance, isInstance } from "./Instance";
import { InstanceExpense } from "./InstanceExpense";
import { InstanceIncome } from "./InstanceIncome";
import { InstanceTransfer } from "./InstanceTransfer";
import { isTemplateAccount, TemplateAccount } from "./TemplateAccount";

export interface InstanceAccount {
    id: string; // TODO: guid
    origin_key?: string;
    instance: string | Instance;
    origin?: string | TemplateAccount;
    account: string | Account;
    start_balance: number;

    expenses: InstanceExpense[];
    incomes: InstanceIncome[];
    transfers: InstanceTransfer[];
}

export function isInstanceAccount(obj: any): obj is InstanceAccount {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && (typeof obj['instance'] === 'string' || isInstance(obj['instance']))
        && (obj['origin'] === undefined || obj['origin'] === null || typeof obj['origin'] === 'string' || isTemplateAccount(obj['origin']))
        && (typeof obj['account'] === 'string' || isAccount(obj['account']))
        && typeof obj['start_balance'] === 'number';
}