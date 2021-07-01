export interface Transfer {
    id: string; // TODO: guid
    origin_key?: string;
    ref: string;
    value: number;
}

export function isTransfer(obj: any): obj is Transfer {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && typeof obj['ref'] === 'string'
        && typeof obj['value'] === 'number';
}