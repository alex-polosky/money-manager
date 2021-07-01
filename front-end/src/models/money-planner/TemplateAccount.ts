import { Account, isAccount } from "./Account";
import { isTemplate, Template } from "./Template";

export interface TemplateAccount {
    id: string; // TODO: guid
    origin_key?: string;
    template: string | Template;
    account: string | Account;
}

export function isTemplateAccount(obj: any): obj is TemplateAccount {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && (typeof obj['template'] === 'string' || isTemplate(obj['template']))
        && (typeof obj['account'] === 'string' || isAccount(obj['account']));
}