import { AbstractPagedApi } from "./api/api";

// export abstract class ArrayLoader<T> implements Iterator<T> {
//     private __isReady: boolean = false;
//     private __counter: number = 0;
//     private __vars: T[] = [];

//     public get isReady(): boolean {
//         return this.__isReady;
//     }

//     public [Symbol.iterator]() {
//         return {
//             next: () => ({
//                 value: this.__vars[this.__counter++],
//                 done: this.__vars.length === this.__counter
//             })
//         };
//     }

//     public next(): IteratorResult<T> {
//         return {
//             value: this.__vars[this.__counter++],
//             done: this.__vars.length === this.__counter
//         };
//     }

//     public push(value: T) {
//         if (this.isReady) {
//             throw new Error("Cannot add any new elements to read only array loader");
//         }
//         this.__vars.push(value);
//     }

//     public async load(): Promise<void> {
//         await this._load();
//         this.__isReady = true;
//     }

//     protected abstract _load(): Promise<void>;
// }

export abstract class ArrayLoader<T> extends Array<T> {
    protected _isReady: boolean = false;
    public get isReady(): boolean {
        return this._isReady;
    }

    public async load(onLoad?: () => void): Promise<void> {
        await this._load();
        this._isReady = true;
        // TODO: turn this class into an immutable array, and only allow _load to load values into it
        (this as any).copyWithin = undefined;
        (this as any).fill = undefined;
        (this as any).pop = undefined;
        (this as any).push = undefined;
        (this as any).reverse = undefined;
        (this as any).shift = undefined;
        (this as any).sort = undefined;
        (this as any).splice = undefined;
        (this as any).unshift = undefined;
        if (onLoad !== undefined) {
            onLoad();
        }
    }

    protected abstract _load(): Promise<void>;
}

export class ArrayApiLoaderMulti<T> extends ArrayLoader<T> {
    protected __apis: AbstractPagedApi<T>[] = [];
    protected __handleEach?: (each: T) => void;

    constructor(handleEach?: (each: T) => void, ...apis: AbstractPagedApi<T>[]) {
        super();
        this.__handleEach = handleEach;
        for (let api of apis) {
            this.__apis.push(api);
        }
    }

    protected async _load(): Promise<void> {
        for (let api of this.__apis) {
            for (let each of await api.get()) {
                this.__handleEach?.(each);
                this.push(each);
            }
        }
    }
}

export class ArrayApiLoader<T> extends ArrayApiLoaderMulti<T> {
    constructor(api: AbstractPagedApi<T>, handleEach?: (each: T) => void) {
        super(handleEach, api);
    }
}