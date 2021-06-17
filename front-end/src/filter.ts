export interface Filter<T> {
    filter: (value: T) => boolean;
    toString?: () => string;
}

export interface FilterableProps<T> {
    objects: T[];
}

export interface FilterableState<T> {
    filteredObjects: T[];
    filters: Filter<T>[];
}
// eslint-disable-next-line
export class FilterableState<T> {
    public static generateStateWithFilters<T>(props: FilterableProps<T>, state: FilterableState<T>, filters?: Filter<T>[]): FilterableState<T> {
        return {
            ...state,
            filters: filters ?? [],
            filteredObjects: FilterableState.filteredTransactions(props.objects, filters ?? [])
        };
    }
    public static filteredTransactions<T>(toFilter: T[], filters: Filter<T>[]): T[] {
        if (filters.length === 0) {
            return [...toFilter];
        }
        return toFilter.filter((trans) => !(filters.map((filter) => (filter.filter(trans))).indexOf(false) > -1));
    }
}