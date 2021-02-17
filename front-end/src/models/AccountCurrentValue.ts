import { Account } from "./Account";

export interface AccountCurrentValue {
    id: string; // TODO: guid
    posted: Date;
    amount: number; // TODO: money
    account: Account | string;
}