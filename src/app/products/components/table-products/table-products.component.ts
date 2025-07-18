import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { TableProductsForm } from './table-products.form';

@Component({
  selector: 'app-table-products',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './table-products.component.html',
  styleUrl: './table-products.component.scss',
})
export class TableProductsComponent extends TableProductsForm {
  public products: Product[] = [];
  public filteredProducts: Product[] = [];

  private route = inject(ActivatedRoute);
  private productsService = inject(ProductsService);
  private _cdr = inject(ChangeDetectorRef);

  public queryParamMap$ = this.route.queryParamMap;
  public products$ = this.productsService.products$;

  ngOnInit(): void {
    this.subs.add(this.products$.subscribe(this.getProducts));
  }

  public getProducts = (products: Product[]): void => {
    if (products.length === 0) {
      return;
    }

    this.products = products;
    this.products = this.products.map(product => {
      product.action = false;
      return product;
    })
    this.filteredProducts = [...this.products];
    this.subs.add(this.queryParamMap$.subscribe(this.queryParamMap));
  };

  public queryParamMap = (queryParamMap: ParamMap): void => {
    const searchText = queryParamMap.get('search');

    if (!queryParamMap.has('search')) {
      this.paginate(this.products);
      return;
    }

    this.searchProduct(searchText as string);
  };

  public searchProduct(search: string): void {
    const filters = search
      ? this.products.filter(
          (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase()) ||
            item.date_release.toString().toLowerCase().includes(search.toLowerCase()) ||
            item.date_revision.toString().toLowerCase().includes(search.toLowerCase())
        )
      : [...this.products];
    this.filteredProducts = filters;
    this.paginate(this.filteredProducts);
    this._cdr.detectChanges();
  }

  public onPageSizeChange(): void {
    this.selectedPageSize = Number(this.size.value);
    this.currentPage = 1;
    this.paginate(this.products);
  }

  public onPageChange(page: number): void {
    this.currentPage = page;
    this.paginate(this.products);
  }

  public paginate(products: Product[]): void {
    const start = (this.currentPage - 1) * this.selectedPageSize;
    const limitPage = start + this.selectedPageSize;
    const end =
      limitPage > this.products.length ? this.products.length : limitPage;
    this.filteredProducts = products.slice(start, end);
  }

  public viewMenuContextual(product: Product): void {
    this.filteredProducts = this.filteredProducts.map(item => {
    if (item.id === product.id) {
      return { ...item, action: !product.action };
    }

    return { ...item, action: false };
  });
  }
}
