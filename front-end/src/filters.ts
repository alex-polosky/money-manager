export interface Filter<T> {
    filter: (value: T) => boolean;
}

export class DateRangeFilter<T extends { posted: Date }> implements Filter<T> {
    from?: Date;
    to?: Date;
    public constructor(from?: Date, to?: Date) {
        this.from = from;
        this.to = to;
    }
    public filter(value: T): boolean {
        if (this.from !== undefined && this.to !== undefined) {
            return this.from <= value.posted && value.posted <= this.to;
        }
        if (this.from !== undefined) {
            return this.from <= value.posted;
        }
        if (this.to !== undefined) {
            return value.posted <= this.to;
        }
        console.warn('No filter to apply');
        return true;
    }
}

export interface FilterableState<T> {
    objects: T[];
    filteredObjects: T[];
    filters: Filter<T>[];
}
// eslint-disable-next-line
export class FilterableState<T> {
    public static generateStateWithFilters<T>(state: FilterableState<T>, filters?: Filter<T>[]): FilterableState<T> {
        return {
            ...state,
            filters: filters ?? [],
            filteredObjects: FilterableState.filteredTransactions(state.objects, filters ?? [])
        };
    }
    public static filteredTransactions<T>(toFilter: T[], filters: Filter<T>[]): T[] {
        return toFilter.filter((trans) => !(filters.map((filter) => (filter.filter(trans))).indexOf(false) > -1));
    }
}