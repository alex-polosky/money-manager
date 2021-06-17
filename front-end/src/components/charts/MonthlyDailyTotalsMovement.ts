import { ChartyProps } from "react-charty";
import { areDatesEqual, isDateInMonth, maxDate, throwError } from "../../helper";
import { DailyTotalsMovement } from "./DailyTotalsMovement";
import { IChart, TotalsMovement } from "./IChart";
import { MonthlyTotalsMovement } from "./MonthlyTotalsMovement";

export class MonthlyDailyTotalsMovement<T extends { amount: number, posted: Date}> implements IChart {
    private _objects: T[];
    constructor(objects: T[]) {
        this._objects = objects;
    }
    public data(): ChartyProps {
        let movement = this.generateXY();
        return {
            title: 'Monthly Daily Total Movement',
            type: "line",
            data: {
                x: movement.map((value) => value.date),
                yGain: movement.map((value) => value.gain),
                yLoss: movement.map((value) => value.loss),
                yNet: movement.map((value) => value.net),
                yTotal: movement.map((value) => value.total),
                yMonthlyGain: movement.map((value) => value.monthlyGain),
                yMonthlyLoss: movement.map((value) => value.monthlyLoss),
                yMonthlyNet: movement.map((value) => value.monthlyNet)
            },
            names: {
                x: 'Date',
                yGain: 'Gain',
                yLoss: 'Loss',
                yNet: 'Net',
                yTotal: 'Total',
                yMonthlyGain: 'Monthly Gain',
                yMonthlyLoss: 'Monthly Loss',
                yMonthlyNet: 'Monthly Net'
            },
            colors: {
                yGain: '#99FF12',
                yLoss: '#FF9912',
                yNet: '#129F9F',
                yTotal: '#323232',
                yMonthlyGain: '#99FF12',
                yMonthlyLoss: '#FF9912',
                yMonthlyNet: '#129F9F',
            },
            rangeTextType: "longDate",
            xAxisType: "longDate",
            yAxisType: "float2",
        };
    }
    public generateXY(): (TotalsMovement &{ monthlyGain: number, monthlyLoss: number, monthlyNet: number })[] {
        if (this._objects.length === 0) {
            return [];
        }
        const dailys = new DailyTotalsMovement(this._objects).generateXY();
        const monthlys = new MonthlyTotalsMovement(this._objects).generateXY();
        const interp = this.interpolateCurrentDateBetweenMonths;
        return dailys.map((v, i) => {
            const currentDate = new Date(v.date);
            const genEmpty = (date: Date): TotalsMovement => ({
                gain: 0, loss: 0, net: 0, total: 0, date: date.getTime()
            });
            let month1 = monthlys.find((m) => isDateInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth(), 0), new Date(m.date))) 
                ?? monthlys.find((m) => isDateInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth()), new Date(m.date)))
                ?? genEmpty(new Date(currentDate.getFullYear(), currentDate.getMonth()));
            month1 = {
                ...month1,
                date: (() => {
                    const date = new Date(month1.date);
                    return (isDateInMonth(date, currentDate) 
                        ? new Date(date.getFullYear(), date.getMonth(), 0)
                        : new Date(date.getFullYear(), date.getMonth() + 1, 0)
                    ).getTime();
                })()
            };
            let month2 = monthlys.find((m) => isDateInMonth(new Date(currentDate.getFullYear(), currentDate.getMonth()), new Date(m.date))) ?? throwError('No monthly data found');
            month2 = {
                ...month2,
                date: (() => {
                    const date = new Date(month2.date);
                    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getTime();
                })()
            };
            // console.log(currentDate, new Date(month1.date), new Date(month2.date));
            return {
                ...v,
                monthlyGain: interp({ date: month1.date, value: month1.gain }, { date: month2.date, value: month2.gain }, v.date),
                monthlyLoss: interp({ date: month1.date, value: month1.loss }, { date: month2.date, value: month2.loss }, v.date),
                monthlyNet: interp({ date: month1.date, value: month1.net }, { date: month2.date, value: month2.net }, v.date)
            }
        });
    }
    private interpolateCurrentDateBetweenMonths(
        startOfMonth: { date: number, value: number },
        endOfMonth: {date: number, value: number },
        currentDate: number): number {
        if (endOfMonth.date === startOfMonth.date || endOfMonth.value === startOfMonth.value ) {
            return startOfMonth.value;
        }
        return ((endOfMonth.value - startOfMonth.value) / (endOfMonth.date - startOfMonth.date)) * (currentDate - startOfMonth.date) + startOfMonth.value;
    }
}