import { Category } from "./Category";

export interface SubCategory extends Category {
    category: Category | SubCategory | string;
}