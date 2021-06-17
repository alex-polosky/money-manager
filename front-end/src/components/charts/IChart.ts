import { ChartyProps } from "react-charty";

export interface TotalsMovement {
    date: number;
    gain: number;
    loss: number;
    net: number;
    total: number;
}

export interface IChart {
    data(): ChartyProps;
}