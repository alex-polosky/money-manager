import { Category, isCategory } from "./Category";

export interface SubCategory extends Category {
    category: Category | SubCategory | string;
}

export function isSubCategory(obj: any): obj is SubCategory {
    if (obj === undefined || obj === null) {
        return false;
    }
    return (
            typeof obj['category'] == 'string'
            || isCategory(obj['category'])
            || isSubCategory(obj['category'])
        )
        && isCategory(obj);
}