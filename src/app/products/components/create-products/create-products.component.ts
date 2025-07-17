import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { InputErrorsComponent } from '@shared/components/input-errors/input-errors.component';
import { CreateProductsForm } from './create-products.form';

@Component({
  selector: 'app-create-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputErrorsComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.scss',
})
export class CreateProductsComponent
  extends CreateProductsForm
  implements OnInit
{
  private productsService = inject(ProductsService);
  private router = inject(Router);

  public product$ = this.productsService.product$;

  get classButtonSend(): Record<string, boolean> {
    return {
      'opacity-low': this.submit || this.invalid,
    };
  }

  ngOnInit(): void {
    this.subs.add(this.product$.subscribe(this.getProduct));
  }

  private getProduct = (product: Product | null): void => {
    if (!product) {
      this.rejected();
      return;
    }

    this.reset();
    this.redirectToList();
  };

  public getClassInvalid(control: string): Record<string, boolean> {
    return {
      'border-red': this.validation.verify(
        this.form.get(control) as AbstractControl
      ),
    };
  }

  public onSubmit(): void {
    this.submited();

    if (this.invalid) {
      return;
    }

    const product = this.form.getRawValue() as Product;
    this.productsService.create(product);
  }

  public reset(): void {
    this.resetForm();
    this.rejected();
  }

  public redirectToList(): void {
    this.router.navigateByUrl('/products/list');
  }

  public updateDateReivision(): void {
    const date = this.dateFnsCustom.parseDate(this.date_release.value);
    const nextYear = this.dateFnsCustom.addYears(1, date);
    this.date_revision.setValue(nextYear);
  }
}
