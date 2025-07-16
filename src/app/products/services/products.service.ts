import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay, Subject } from 'rxjs';
import { Product } from '../types/product';
import { ProductsResponse } from '../types/product.response';
import { ProductsHttpService } from './products-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  private productsSubject = new Subject<Product[]>();

  private http = inject(ProductsHttpService);

  get products$() {
    return this.productsSubject.asObservable().pipe(shareReplay(1));
  }

  public list(): void {
    this.http.list$()
    .subscribe({
      next: this.nextList,
      error: this.errorList,
    });
  };

  private nextList = (response: ProductsResponse): void => {
    if (!response) {
      this.productsSubject.next([]);
      return;
    }

    const products = response.data;
    this.productsSubject.next(products);
  };

  private errorList = (error: HttpErrorResponse): void => {
    this.productsSubject.next([]);
  };
}
