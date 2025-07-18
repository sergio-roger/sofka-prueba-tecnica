import { AbstractControl, Validators } from '@angular/forms';
import { SofkaFormDirective } from '@core/directives/sofka-form.directive';
import { DateFnsCustom } from '@core/utils/date-fsn-custom';
import { dateReleaseValidator } from '@products/validators/date-release.validator';
import { dateRevisionValidator } from '@products/validators/date-revision.validator';
import { productIdValidator } from '@products/validators/id-product.validator';

export class CreateProductsForm extends SofkaFormDirective {
  public dateFnsCustom = new DateFnsCustom();

  protected today = this.dateFnsCustom.today();
  protected nextYear = this.dateFnsCustom.addYears(1);

  private skeleton = {
    id: [
      '',
      {
        validators: [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
        asyncValidators: [productIdValidator()],
        updateOn: 'blur',
      },
    ],
    name: [
      '',
      [Validators.required, Validators.minLength(5), Validators.maxLength(100)],
    ],
    description: [
      '',
      [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(200),
      ],
    ],
    logo: ['', Validators.required],
    date_release: [this.today, [Validators.required, dateReleaseValidator()]],
    date_revision: [{value: this.nextYear, disabled: true }, [Validators.required]],
  };

  public form = this.fb.group(this.skeleton, {
    validators: [dateRevisionValidator()],
  });

  get id() {
    return this.form.get('id') as AbstractControl;
  }

  get name() {
    return this.form.get('name') as AbstractControl;
  }

  get description() {
    return this.form.get('description') as AbstractControl;
  }

  get logo() {
    return this.form.get('logo') as AbstractControl;
  }

  get date_release() {
    return this.form.get('date_release') as AbstractControl;
  }

  get date_revision() {
    return this.form.get('date_revision') as AbstractControl;
  }

  get invalid() {
    return this.form.invalid;
  }

  public resetForm(): void {
    this.form.reset();
    this.date_release.setValue(this.today);
    this.date_revision.setValue(this.nextYear);
  }
}
