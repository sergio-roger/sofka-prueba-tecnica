import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Product } from '../types/product';
import { ProductResponse, ProductResponseObservable, ProductsResponse, ProductsResponseObservable } from '../types/product.response';

@Injectable({
  providedIn: 'root'
})
export class ProductsHttpService {

  private http = inject(HttpClient);

  public list$(): ProductsResponseObservable {
    const url = `${environment.api}/products`;
    return this.http.get<ProductsResponse>(url);
  }

  public create$(product: Product): ProductResponseObservable {
    const url = `${environment.api}/products`;
    return this.http.post<ProductResponse>(url, product);
  }
}
