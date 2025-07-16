import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Product } from '../../types/product';

@Component({
  selector: 'app-list-products',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './list-products.component.html',
  styleUrl: './list-products.component.scss'
})
export class ListProductsComponent {
  public products: Product[] = [];
  public filteredProducts: Product[] = [];
  public searchTerm: string = '';

  onSearch() {
    // const term = this.searchTerm.toLowerCase();
    // this.filteredProducts = this.products.filter(
    //   product =>
    //     product.name.toLowerCase().includes(term) ||
    //     product.category.toLowerCase().includes(term)
    // );
  }
}
