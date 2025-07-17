import { inject } from '@angular/core';
import { AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { ProductsService } from '@products/services/products.service';
import { catchError, map, of } from 'rxjs';

export const productIdValidator = (): AsyncValidatorFn => {
  const productService = inject(ProductsService);

  return (control: AbstractControl) => {
    if (!control.value) {
      return of(null);
    }

    productService.verificationId(control.value);

    return productService.idValid$.pipe(
      map((isValid: boolean) => {
        if (isValid) {
          const errorJSON = { invalidProductId: true };
          control.setErrors(errorJSON);
          return errorJSON;
        }

        return null;
      }),
      catchError(() => of(null))
    );
  };
};
