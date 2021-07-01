import { isTemplateAccount, TemplateAccount } from "./TemplateAccount";
import { isTransfer, Transfer } from "./Transfer";

export interface TemplateTransfer {
    id: string; // TODO: guid
    origin_key?: string;
    template: string | TemplateAccount;
    transfer: string | Transfer;
}

export function isTemplateTransfer(obj: any): obj is TemplateTransfer {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && (typeof obj['template'] === 'string' || isTemplateAccount(obj['template']))
        && (typeof obj['transfer'] === 'string' || isTransfer(obj['transfer']));
}