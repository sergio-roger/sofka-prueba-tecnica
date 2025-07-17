import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { addYears, isAfter, startOfDay, parseISO } from 'date-fns';

export function dateRevisionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateReleaseControl = control.get('date_release');
    const dateRevisionControl = control.get('date_revision');

    if (!dateReleaseControl || !dateRevisionControl) {
      return null;
    }

    const dateReleaseValue = dateReleaseControl.value;
    const dateRevisionValue = dateRevisionControl.value;

    if (!dateReleaseValue || !dateRevisionValue) {
      return null;
    }

    try {
      const dateRelease = startOfDay(parseISO(dateReleaseValue));
      const minValidDate = startOfDay(addYears(dateRelease, 1));
      const dateRevision = startOfDay(parseISO(dateRevisionValue));

      const isValid =
        isAfter(dateRevision, minValidDate) ||
        dateRevision.getTime() === minValidDate.getTime();

      if (!isValid) {
        dateRevisionControl?.setErrors({ invalidDateRevision: true });
        return { invalidDateRevision: true };
      } else {
        return null;
      }
    } catch {
      const invalidDate = { invalidDate: 'Fecha inválida' };
      control?.get('invalidDate')?.setErrors(invalidDate);
      return invalidDate;
    }
  };
}
