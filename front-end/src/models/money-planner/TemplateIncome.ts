import { Income, isIncome } from "./Income";
import { isTemplateAccount, TemplateAccount } from "./TemplateAccount";

export interface TemplateIncome {
    id: string; // TODO: guid
    origin_key?: string;
    template: string | TemplateAccount;
    income: string | Income;
}

export function isTemplateIncome(obj: any): obj is TemplateIncome {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && (typeof obj['template'] === 'string' || isTemplateAccount(obj['template']))
        && (typeof obj['income'] === 'string' || isIncome(obj['income']));
}