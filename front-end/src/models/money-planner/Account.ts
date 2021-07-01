export interface Account {
    id: string; // TODO: guid
    origin_key?: string;
    name_friendly: string;
    provider: string;
}

export function isAccount(obj: any): obj is Account {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && typeof obj['name_friendly'] === 'string'
        && typeof obj['provider'] === 'string';
}