import {DaysOfTheWeek} from "../../children/cabinet/enums/days-of-the-week";
import {MonthInDate} from "../../children/cabinet/enums/months";

export class Day {
  private year = new Date().getFullYear().toString();
  private month = `${(new Date().getMonth() + 1) < 10 ? "0" : ""}${new Date().getMonth() + 1}`
  private day = `${new Date().getDate() < 10 ? "0" : ""}${new Date().getDate()}`

  public getToday(): string {
    return `${this.year}-${this.month}-${this.day}`
  }

  /**
   *
   * @param param - day | month | year
   * @param fullDate - Полная дана YYYY-MM-DD
   * @return current param
   */
  public getDate(fullDate: string, param: 'day' | 'month' | 'year'): string {
    let parseDate = fullDate.split('-');
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
        return this.day;
      case 'month':
        return this.month;
      case 'year':
        return this.year;
      default:
        return '';
    }
  }

  public getDay(date: string) {
    let parseDate = date.split('-');
    if (parseDate[0] === this.year && parseDate[1] === this.month) {
      if (parseDate[2] === this.day) {
        return 'Сегодня';
      }
      if (parseDate[2] === (parseInt(this.day) - 1).toString()) {
        return 'Вчера';
      }
      if (parseInt(this.day) - parseInt(parseDate[2]) < 5) {
        let currentDay = new Date().getDay();
        let dayDiff = parseInt(this.day) - parseInt(parseDate[2]);
        if (currentDay - dayDiff < 0) {
          return DaysOfTheWeek[6 - currentDay - dayDiff];
        }

        return DaysOfTheWeek[currentDay - dayDiff];
      }
    }

    return `${parseDate[2]} ${MonthInDate[parseInt(parseDate[1])]} ${parseDate[0]}г.`
  }
}
