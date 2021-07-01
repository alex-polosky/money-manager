import { InstanceAccount } from "./InstanceAccount";
import { isTemplate, Template } from "./Template";

export interface Instance {
    id: string; // TODO: guid
    origin_key?: string;
    date: Date;
    origin?: Template | string

    accounts: InstanceAccount[];
}

export function isInstance(obj: any): obj is Instance {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && obj['date'] instanceof Date
        && (obj['origin'] === undefined || obj['origin'] === null || typeof obj['origin'] === 'string' || isTemplate(obj['origin']));
}