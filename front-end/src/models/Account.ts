export enum AccountClassifier {
    NONE = 0,
    CASH = 1,
    CREDIT_CARD = 2,
    LOAN = 3,
    INVESTMENT = 4,
    VIRTUAL = 5
}

export interface Account {
    id: string; // TODO: guid
    classifier: AccountClassifier;
    name_transaction: string;
    provider: string;
    name_friendly: string;
    is_active: boolean;
}