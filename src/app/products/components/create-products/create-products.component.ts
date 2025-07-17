import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputErrorsComponent } from '@shared/components/input-errors/input-errors.component';
import { CreateProductsForm } from './create-products.form';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';

@Component({
  selector: 'app-create-products',
  standalone: true,
  imports: [CommonModule, InputErrorsComponent, FormsModule, ReactiveFormsModule],
  templateUrl: './create-products.component.html',
  styleUrl: './create-products.component.scss'
})
export class CreateProductsComponent extends CreateProductsForm implements OnInit{

  private productsService = inject(ProductsService);

  public product$ = this.productsService.product$;

  get classButtonSend(): Record<string, boolean> {
    return {
      'opacity-low': this.submit || this.invalid,
    }
  }

  ngOnInit(): void {
    this.subs.add(this.product$.subscribe(this.getProduct));
  }

  private getProduct = (product: Product | null): void => {
    this.rejected();
  };

  public getClassInvalid(control: string): Record<string, boolean> {
    return {
      'border-red': this.validation.verify(this.form.get(control) as AbstractControl),
    }
  }

  public onSubmit(): void {
    this.submited();

    if (this.invalid) {
      return;
    }

    const product = this.form.value as Product;
    this.productsService.create(product);
  }

  public reset(): void {
    this.form.reset();
    this.rejected();
  }
}
