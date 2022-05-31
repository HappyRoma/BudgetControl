import { DaysOfTheWeek } from '../../children/cabinet/enums/days-of-the-week';
import { MonthInDate } from '../../children/cabinet/enums/months';

export class Day {
    private _year: string = new Date().getFullYear().toString();
    private _month: string = `${(new Date().getMonth() + 1) < 10 ? '0' : ''}${new Date().getMonth() + 1}`;
    private _day: string = `${new Date().getDate() < 10 ? '0' : ''}${new Date().getDate()}`;

    public getToday(): string {
        return `${this._year}-${this._month}-${this._day}`;
    }

    /**
   *
   * @param param - day | month | year
   * @param fullDate - Полная дана YYYY-MM-DD
   * @return current param
   */
    public getDate(fullDate: string, param: 'day' | 'month' | 'year'): string {
        const parseDate: string[] = fullDate.split('-');
        if (param === 'day') {
            return parseDate[2];
        }
        if (param === 'month') {
            return parseDate[1];
        }
        if (param === 'year') {
            return parseDate[0];
        }

        return '';
    }

    /**
   *
   * @param param - day | month | year
   * @return current param
   */
    public getTodayDate(param: string): string {
        switch (param) {
            case 'day':
                return this._day;
            case 'month':
                return this._month;
            case 'year':
                return this._year;
            default:
                return '';
        }
    }

    public getDay(date: string): string {
        const parseDate: string[] = date.split('-');
        if (parseDate[0] === this._year && parseDate[1] === this._month) {
            if (parseDate[2] === this._day) {
                return 'Сегодня';
            }
            if (parseDate[2] === (parseInt(this._day) - 1).toString()) {
                return 'Вчера';
            }
            if (parseInt(this._day) - parseInt(parseDate[2]) < 5) {
                const currentDay: number = new Date().getDay();
                const dayDiff: number = parseInt(this._day) - parseInt(parseDate[2]);
                if (currentDay - dayDiff < 0) {
                    return DaysOfTheWeek[6 - (dayDiff - currentDay) + 1];
                }

                return DaysOfTheWeek[currentDay - dayDiff];
            }
        }

        return `${parseDate[2]} ${MonthInDate[parseInt(parseDate[1])]} ${parseDate[0]}г.`;
    }
}
