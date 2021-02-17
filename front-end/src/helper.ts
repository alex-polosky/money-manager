export function RenderDate(date: Date): string {
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
    const padDay: (v: number) => string = (v: number) => {
        return v < 10 ? '0' + v.toString() : v.toString();
    };
    return `${months[date.getMonth()]}-${padDay(date.getDate())}-${date.getFullYear()}`;
}