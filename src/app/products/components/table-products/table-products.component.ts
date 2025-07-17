import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { TableProductsForm } from './table-products.form';

@Component({
  selector: 'app-table-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-products.component.html',
  styleUrl: './table-products.component.scss',
})
export class TableProductsComponent extends TableProductsForm {
  public products: Product[] = [];
  public filteredProducts: Product[] = [];

  private productsService = inject(ProductsService);

  public products$ = this.productsService.products$;

  ngOnInit(): void {
    this.subs.add(this.products$.subscribe(this.getProducts));
  }

  private getProducts = (products: Product[]): void => {
    if (products.length === 0) {
      return;
    }

    this.products = products;
    this.filteredProducts = [...this.products];
    this.paginate();
  };

  public onPageSizeChange(): void {
    this.selectedPageSize = Number(this.size.value);
    this.currentPage = 1;
    this.paginate();
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate();
  }

  private paginate(): void {
    const start = (this.currentPage - 1) * this.selectedPageSize;
    const limitPage = start + this.selectedPageSize;
    const end =
      limitPage > this.products.length ? this.products.length : limitPage;
    this.filteredProducts = this.products.slice(start, end);
  }
}
