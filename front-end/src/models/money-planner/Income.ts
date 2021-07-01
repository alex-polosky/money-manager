export interface Income {
    id: string; // TODO: guid
    origin_key?: string;
    ref: string;
    value: number;
}

export function isIncome(obj: any): obj is Income {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && typeof obj['ref'] === 'string'
        && typeof obj['value'] === 'number';
}