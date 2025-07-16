import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ProductsResponse, ProductsResponseObservable } from '../types/product.response';

@Injectable({
  providedIn: 'root'
})
export class ProductsHttpService {

  private http = inject(HttpClient);

  public list$(): ProductsResponseObservable {
    const url = `${environment.api}/products`;
    return this.http.get<ProductsResponse>(url);
  }
}
