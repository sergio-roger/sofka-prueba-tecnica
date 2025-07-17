import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductsService } from '@products/services/products.service';
import { TableProductsComponent } from '../table-products/table-products.component';
import { FilterProductsComponent } from '../filter-products/filter-products.component';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, FormsModule, FilterProductsComponent, TableProductsComponent],
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
}
