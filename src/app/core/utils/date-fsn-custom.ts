import { format } from "date-fns";
import { addYears } from 'date-fns';

export class DateFnsCustom {
  private formatDate = 'yyyy-MM-dd';
  private todayGet = format(new Date(), this.formatDate);

  public today(): string {
    return this.todayGet;
  }

  public addYears(year: number): string {
    if (!Number(year)) {
      return format(addYears(new Date(), 1), this.formatDate);
    }

    return format(addYears(new Date(), year), this.formatDate)
  }
}
