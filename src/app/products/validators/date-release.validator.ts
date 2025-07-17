import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { isBefore, isEqual, parseISO, startOfDay } from 'date-fns';

export const dateReleaseValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    try {
      const selectedDate = startOfDay(parseISO(value));
      const today = startOfDay(new Date());

      const isValid =
        isEqual(selectedDate, today) || !isBefore(selectedDate, today);

      return isValid ? null : { invalidDateRelease: true };
    } catch {
      return { invalidDate: 'Fecha inválida' };
    }
  };
};
