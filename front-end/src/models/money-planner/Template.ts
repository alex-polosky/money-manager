export interface Template {
    id: string; // TODO: guid
    origin_key?: string;
    date: string; // 'yyyy-mm-dd' / 'xxxx-mm-dd' / 'xxxx-xx-dd' / 'xxxx-mm-xx'
    previous?: string | Template;
    next?: string | Template;
}

export function isTemplate(obj: any): obj is Template {
    if (obj === undefined || obj == null) {
        return false;
    }
    return typeof obj['id'] === 'string'
        && (obj['origin_key'] === undefined || obj['origin_key'] === null || typeof obj['origin_key'] === 'string')
        && typeof obj['date'] === 'string'
        && (obj['previous'] === undefined || obj['previous'] === null || typeof obj['previous'] === 'string' || isTemplate(obj['previous']))
        && (obj['next'] === undefined || obj['next'] === null || typeof obj['next'] === 'string' || isTemplate(obj['next']));
}