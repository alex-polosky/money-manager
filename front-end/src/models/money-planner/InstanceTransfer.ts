import { InstanceAccount, isInstanceAccount } from "./InstanceAccount";
import { isTemplateTransfer, TemplateTransfer } from "./TemplateTransfer";
import { isTransfer, Transfer } from "./Transfer";

export interface InstanceTransfer {
    id: string; // TODO: guid
    origin_key?: string;
    instance_account: string | InstanceAccount;
    origin?: string | TemplateTransfer;
    obj: string | Transfer;
}

export function isInstanceTransfer(obj: any): obj is InstanceTransfer {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && (typeof obj['instance_account'] === 'string' || isInstanceAccount(obj['instance_account']))
        && (obj['origin'] === undefined || obj['origin'] === null || typeof obj['origin'] === 'string' || isTemplateTransfer(obj['origin']))
        && (typeof obj['obj'] === 'string' || isTransfer(obj['obj']));
}