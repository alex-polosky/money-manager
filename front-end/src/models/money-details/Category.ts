export interface Category {
    id: string; // TODO: guid
    origin_key?: string;
    name: string;
    from_mint: boolean;
}

export function isCategory(obj: any): obj is Category {
    if (obj === undefined || obj === null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && typeof obj['name'] === 'string'
        && typeof obj['from_mint'] === 'boolean';
}