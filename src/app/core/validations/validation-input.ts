import { AbstractControl } from '@angular/forms';

export class ValidationInput {
  public static verify(ac: AbstractControl): boolean {
    return ac.invalid && (ac.dirty || ac.touched);
  }
}
