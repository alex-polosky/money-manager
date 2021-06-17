import { ChartyProps } from "react-charty";
import { isDateInMonth } from "../../helper";
import { IChart, TotalsMovement } from "./IChart";

export class MonthlyTotalsMovement<T extends { amount: number, posted: Date}> implements IChart {
    private _objects: T[];
    constructor(objects: T[]) {
        this._objects = objects;
    }
    public data(): ChartyProps {
        let movement = this.generateXY();
        return {
            title: 'Monthly Total Movement',
            type: "line",
            data: {
                x: movement.map((value) => value.date),
                yGain: movement.map((value) => value.gain),
                yLoss: movement.map((value) => value.loss),
                yNet: movement.map((value) => value.net),
                yTotal: movement.map((value) => value.total)
            },
            names: {
                x: 'Date',
                yGain: 'Gain',
                yLoss: 'Loss',
                yNet: 'Net',
                yTotal: 'Total'
            },
            colors: {
                yGain: '#99FF12',
                yLoss: '#FF9912',
                yNet: '#129F9F',
                yTotal: '#323232'
            },
            rangeTextType: "longDate",
            xAxisType: "longDate",
            yAxisType: "float2",
        };
    }
    public generateXY(): TotalsMovement[] {
        if (this._objects.length === 0) {
            return [];
        }
        const objects = [...this._objects].reverse();
        const start = new Date(objects[0].posted.getFullYear(), objects[0].posted.getMonth());
        const end = new Date(objects[objects.length - 1].posted.getFullYear(), objects[objects.length - 1].posted.getMonth());
        const dates: Date[] = [start];
        let nextDate = start;
        let i = 1;
        while (nextDate.getTime() < end.getTime()) {
            nextDate = new Date(start.getFullYear(), start.getMonth() + i++);
            dates.push(nextDate);
        }
        let total = 0;
        return dates
            .map((date) => ({
                date: date.getTime(),
                gain: objects
                    .filter((t) => isDateInMonth(t.posted, date) && t.amount > 0)
                    .reduce((sum, current) => sum + current.amount, 0),
                loss: objects
                    .filter((t) => isDateInMonth(t.posted, date) && t.amount < 0)
                    .reduce((sum, current) => sum + current.amount, 0),
                net: 0,
                total: 0
            }))
            .map((v) => ({
                ...v,
                net: v.gain + v.loss,
                total: (() => {
                    total += v.gain + v.loss;
                    return total;
                })()
            }));
    }
}