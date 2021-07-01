import { Income, isIncome } from "./Income";
import { InstanceAccount, isInstanceAccount } from "./InstanceAccount";
import { isTemplateIncome, TemplateIncome } from "./TemplateIncome";

export interface InstanceIncome {
    id: string; // TODO: guid
    origin_key?: string;
    instance_account: string | InstanceAccount;
    origin?: string | TemplateIncome;
    obj: string | Income;
}

export function isInstanceIncome(obj: any): obj is InstanceIncome {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && (typeof obj['instance_account'] === 'string' || isInstanceAccount(obj['instance_account']))
        && (obj['origin'] === undefined || obj['origin'] === null || typeof obj['origin'] === 'string' || isTemplateIncome(obj['origin']))
        && (typeof obj['obj'] === 'string' || isIncome(obj['obj']));
}