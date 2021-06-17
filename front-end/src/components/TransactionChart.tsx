import React, { ReactNode } from "react";
import Charty from 'react-charty';
import { PostType, Transaction } from "../models/Transaction";
import { DailyTotalsMovement } from "./charts/DailyTotalsMovement";
import { MonthlyDailyTotalsMovement } from "./charts/MonthlyDailyTotalsMovement";
import { MonthlyTotalsMovement } from "./charts/MonthlyTotalsMovement";

interface TransactionChartProps {
    objects: Transaction[];
}
interface TransactionChartState {
}

class TransactionChart extends React.Component<TransactionChartProps, TransactionChartState> {
    public render(): ReactNode {
        return this.props.objects.length === 0 ? (
        <div>
            No objects available to display charts
        </div>) : (
        <div>
            {/* <Charty {...new DailyTotalsMovement(this.props.objects.map((v) => ({
                ...v,
                amount: v.post_type === PostType.CREDIT ? v.amount : (0 - v.amount)
            }))).data()} /> */}
            {/* <Charty {...new MonthlyTotalsMovement(this.props.objects.map((v) => ({
                ...v,
                amount: v.post_type === PostType.CREDIT ? v.amount : (0 - v.amount)
            }))).data()} /> */}
            <Charty {...new MonthlyDailyTotalsMovement(this.props.objects.map((v) => ({
                ...v,
                amount: v.post_type === PostType.CREDIT ? v.amount : (0 - v.amount)
            }))).data()} />
        </div>);
    }
}

export default TransactionChart;