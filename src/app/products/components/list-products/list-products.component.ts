import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { TableProductsComponent } from '../table-products/table-products.component';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TableProductsComponent],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss',
})
export class ListProductsComponent implements OnInit {
  public search = '';

  private productsService = inject(ProductsService);

  public products$ = this.productsService.products$;

  ngOnInit(): void {
    this.productsService.list();
  }

  public onSearch(): void {
    // this.filteredProducts = this.products.filter(product =>
    //   product.name.toLowerCase().includes(this.search.toLowerCase())
    // );
    // this.currentPage = 1;
    // this.paginate();
  }
}
