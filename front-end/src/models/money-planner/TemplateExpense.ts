import { Expense, isExpense } from "./Expense";
import { isTemplateAccount, TemplateAccount } from "./TemplateAccount";

export interface TemplateExpense {
    id: string; // TODO: guid
    origin_key?: string;
    template: string | TemplateAccount;
    expense: string | Expense;
}

export function isTemplateExpense(obj: any): obj is TemplateExpense {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && (typeof obj['template'] === 'string' || isTemplateAccount(obj['template']))
        && (typeof obj['expense'] === 'string' || isExpense(obj['expense']));
}