import { CommonModule, Location } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { InputErrorsComponent } from '@shared/components/input-errors/input-errors.component';
import { CreateProductsForm } from '../create-products/create-products.form';

@Component({
  selector: 'app-edit-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputErrorsComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-products.component.html',
  styleUrl: './edit-products.component.scss',
})
export class EditProductsComponent
  extends CreateProductsForm
  implements OnInit
{
  public idParam = '';
  public product: Product | null = null;

  private router = inject(Router);
  private location = inject(Location);
  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);

  public param$ = this.route.params;
  public products$ = this.productsService.products$;
  public product$ = this.productsService.product$;

  get classButtonSend(): Record<string, boolean> {
    return {
      'opacity-low': this.submit || this.invalid,
    };
  }

  ngOnInit(): void {
    this.subs.add(this.param$.subscribe(this.getParams));
    this.subs.add(this.products$.subscribe(this.getProducts));
    this.subs.add(this.product$.subscribe(this.getProduct));

    this.id.disable();
  }

  private getParams = (params: Params): void => {
    if (!params['id']) {
      this.router.navigateByUrl('/products/list');
      return;
    }

    this.idParam = params['id']
    this.productsService.list();
  };

  private getProducts = (products: Product[]): void => {
    if (products.length === 0) {
      return;
    }

    this.product = products.find(product => product.id === this.idParam) || null;
    this.fillForm();
  };

  private getProduct = (product: Product | null): void => {
    if (!product) {
      this.rejected();
      return;
    }

    this.redirectToList();
  };

  public fillForm(): void {
    if (!this.product) {
      return;
    }

    this.id.patchValue(this.product.id);
    this.name.patchValue(this.product.name);
    this.description.patchValue(this.product.description);
    this.logo.patchValue(this.product.logo);
    this.date_release.patchValue(this.product.date_release);
    this.date_revision.patchValue(this.product.date_revision);
  }

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
    this.productsService.update(product);
  }

  public updateDateReivision(): void {
    const date = this.dateFnsCustom.parseDate(this.date_release.value);
    const nextYear = this.dateFnsCustom.addYears(1, date);
    this.date_revision.setValue(nextYear);
  }

  public back(): void {
    this.location.back();
  }

  public redirectToList(): void {
    this.router.navigateByUrl('/products/list');
  }
}
