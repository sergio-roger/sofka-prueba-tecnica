import { AbstractControl } from '@angular/forms';
import { SofkaFormDirective } from '@core/directives/sofka-form.directive';

export class FilterProductsForm extends SofkaFormDirective {
  private skeleton = {
    search: [''],
  };

  protected form = this.fb.group(this.skeleton);

  get search() {
    return this.form.get('search') as AbstractControl;
  }
}
