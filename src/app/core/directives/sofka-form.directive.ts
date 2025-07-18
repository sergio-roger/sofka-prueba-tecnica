import { Directive, inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ValidationInput } from '@core/validations/validation-input';
import { SofkaSubsDirective } from './sofka-subs.directive';

@Directive({
  selector: '[appSofkaForm]',
  standalone: true
})
export class SofkaFormDirective extends SofkaSubsDirective {
  protected fb = inject(FormBuilder);

  private submitForm = false;
  private loaderForm = false;
  public validation = ValidationInput;

  get loader() {
    return this.loaderForm;
  }

  get submit() {
    return this.submitForm;
  }

  public submited(): void {
    this.submitForm = true;
  }

  public rejected(): void {
    this.submitForm = false;
  }

  public enableLoader(): void {
    this.loaderForm = true;
  }

  public disableLoader(): void {
    this.loaderForm = false;
  }
}
