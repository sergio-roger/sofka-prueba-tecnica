import { AbstractControl } from '@angular/forms';
import { SofkaFormDirective } from '@core/directives/sofka-form.directive';

export class TableProductsForm extends SofkaFormDirective {
  public optionsSize = [5,10,20];
  public currentPage = 1;
  public selectedPageSize = this.optionsSize[0];

  private skeleton = {
    size: [this.optionsSize[0]],
  };

  protected form = this.fb.group(this.skeleton);

  get size() {
    return this.form.get('size') as AbstractControl;
  }
}
