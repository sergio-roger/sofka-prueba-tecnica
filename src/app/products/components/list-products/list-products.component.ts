import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../types/product';
import { ProductsService } from '../../services/products.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent  implements OnInit, OnDestroy {
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public searchTerm: string = '';
  public subs = new Subscription();

  private productsService = inject(ProductsService);

  public products$ = this.productsService.products$;

  ngOnInit(): void {
    this.subs.add(this.products$.subscribe(this.getProducts));

    this.productsService.list();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  private getProducts = (products: Product[]): void => {
    if (products.length > 0) {
      return;
    }

    this.products = products;
    this.filteredProducts = products;
  };

  public onSearch(): void {}
}
