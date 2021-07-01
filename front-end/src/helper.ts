import { DateTime } from "luxon";

const padDay: (v: number) => string = (v: number) => {
    return v < 10 ? '0' + v.toString() : v.toString();
};

export const maxDate = new Date(99999, 999999, 9999999, 99999999, 9999999999, 999999999999, 9999999999999);

export function renderShortDate(date: Date): string {
    const months: { [key: number]: string } = {
        0: 'Jan',
        1: 'Feb',
        2: 'Mar',
        3: 'Apr',
        4: 'May',
        5: 'Jun',
        6: 'Jul',
        7: 'Aug',
        8: 'Sep',
        9: 'Oct',
        10: 'Nov',
        11: 'Dec'
    }
    return `${months[date.getMonth()]}-${padDay(date.getDate())}-${date.getFullYear()}`;
}

export function renderUSADate(date: Date, separator: string = '-'): string {
    return `${date.getFullYear()}${separator}${padDay(date.getMonth()+1)}${separator}${padDay(date.getDate())}`
}

export function areDatesEqual(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

export function isDateBetween(date: Date, from?: Date, to?: Date) {
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    if (from !== undefined && to !== undefined) {
        return from <= date && date <= to;
    }
    if (from !== undefined) {
        return from <= date;
    }
    if (to !== undefined) {
        return date <= to;
    }
    console.warn('No dates to compare to');
    return true;
}

export function isDateInMonth(dateToCheck: Date, targetDate: Date): boolean {
    return isDateBetween(dateToCheck, new Date(targetDate.getFullYear(), targetDate.getMonth()), new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0));
}

export function throwError(error: string | Error): never {
    if (typeof error === 'string') {
        throw new Error(error);
    } else {
        throw error;
    }
}

export function ensureDate(date: Date): Date {
    return (typeof date === 'string') !== undefined ? DateTime.fromFormat(date as unknown as string, 'yyyy-MM-dd').toJSDate() : date;
}

export function dton(decimalNumber: number): number {
    // return parseInt((decimalNumber / 100).toFixed(0)) + parseInt((decimalNumber / 100).toFixed(2).split('.')[1]) / 100
    return (decimalNumber / 100);
}