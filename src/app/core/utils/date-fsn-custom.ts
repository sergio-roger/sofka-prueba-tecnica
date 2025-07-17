import { format, parse } from "date-fns";
import { addYears } from 'date-fns';

export class DateFnsCustom {
  private formatDateString = 'yyyy-MM-dd';
  private todayGet = this.formatDate(new Date());

  public today(): string {
    return this.todayGet;
  }

  public addYears(year: number, date: Date = new Date()): string {
    if (!Number(year)) {
      return this.formatDate(addYears(date, 1));
    }

    return this.formatDate(addYears(date, year))
  }

  public formatDate(date: Date): string {
    return format(date, this.formatDateString);
  }

  public parseDate(date: string): Date {
    return parse(date, 'yyyy-MM-dd', new Date());
  }
}
