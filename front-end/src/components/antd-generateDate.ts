import { GenerateConfig } from "rc-picker/lib/generate"

// TODO: remove debug code; this should be figured out
(window as any)._debugDateConfig = {
    formats: []
};

const DateConfig: GenerateConfig<Date> = {
    getWeekDay: (value: Date): number => {
        return value.getDay();
    },
    getSecond: (value: Date): number => {
        return value.getSeconds();
    },
    getMinute: (value: Date): number => {
        return value.getMinutes();
    },
    getHour: (value: Date): number => {
        return value.getHours();
    },
    getDate: (value: Date): number => {
        return value.getDate();
    },
    getMonth: (value: Date): number => {
        return value.getMonth();
    },
    getYear: (value: Date): number => {
        return value.getFullYear();
    },
    getNow: (): Date => {
        return new Date();
    },
    getFixedDate: (fixed: string): Date => {
        return new Date(fixed);
    },
    getEndDate: (value: Date): Date => {
        return new Date(value.getFullYear(), value.getMonth() + 1, 0);
    },
    addYear: (value: Date, diff: number): Date => {
        return new Date(value.getFullYear() + diff, value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    },
    addMonth: (value: Date, diff: number): Date => {
        return new Date(value.getFullYear(), value.getMonth() + diff, value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    },
    addDate: (value: Date, diff: number): Date => {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate() + diff, value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    },
    setYear: (value: Date, year: number): Date => {
        return new Date(year, value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    },
    setMonth: (value: Date, month: number): Date => {
        return new Date(value.getFullYear(), month, value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    },
    setDate: (value: Date, date: number): Date => {
        return new Date(value.getFullYear(), value.getMonth(), date, value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    },
    setHour: (value: Date, hour: number): Date => {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate(), hour, value.getMinutes(), value.getSeconds(), value.getMilliseconds());
    },
    setMinute: (value: Date, minute: number): Date => {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), minute, value.getSeconds(), value.getMilliseconds());
    },
    setSecond: (value: Date, second: number): Date => {
        return new Date(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), second, value.getMilliseconds());
    },
    isAfter: (date1: Date, date2: Date): boolean => {
        return date1 > date2;
    },
    isValidate: (date: Date): boolean => {
        // TODO: Figure how tf to do this?
        return true;
    },
    locale: {
        getWeekFirstDay: (locale: string): number => {
            return 0;
        },
        getWeekFirstDate: (locale: string, value: Date): Date => {
            return new Date(value.getFullYear(), value.getMonth(), value.getDate() - value.getDay(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
        },
        getWeek: (locale: string, value: Date): number => {
            //// https://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php

            // Copy date so don't modify original
            let d = new Date(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()));
            // Set to nearest Thursday: current date + 4 - current day number
            // Make Sunday's day number 7
            d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay()||7));
            // Get first day of year
            var yearStart = new Date(Date.UTC(d.getUTCFullYear(),0,1));
            // Calculate full weeks to nearest Thursday
            var weekNo = Math.ceil(( ( ((d as any) - (yearStart as any)) / 86400000) + 1)/7);
            // Return array of year and week number
            return weekNo;
        },
        format: (locale: string, date: Date, format: string): string => {
            if ((window as any)._debugDateConfig.formats.indexOf(format) < 0) {
                (window as any)._debugDateConfig.formats.push(format);
            }
            return format
                .replace('YYYY', date.getFullYear().toString().padStart(4, '0'))
                .replace('MM', (date.getMonth() + 1).toString().padStart(2, '0'))
                .replace('DD', date.getDate().toString().padStart(2, '0'));
        },
        /** Should only return validate date instance */
        parse: (locale: string, text: string, formats: string[]): Date | null => {
            console.log(text, formats);
            return null;
        },
        // /** A proxy for getting locale with moment or other locale library */
        // getShortWeekDays: (locale: string): string[] => {

        // },
        // /** A proxy for getting locale with moment or other locale library */
        // getShortMonths: (locale: string): string[] => {

        // }
    }
};

export default DateConfig;