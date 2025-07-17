import { HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { shareReplay, Subject } from 'rxjs';
import { Product } from '../types/product';
import { ProductResponse, ProductsResponse } from '../types/product.response';
import { ProductsHttpService } from './products-http.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productsSubject = new Subject<Product[]>();
  private productSubject = new Subject<Product | null>();
  private idValidSubject = new Subject<boolean>();

  private toastr = inject(ToastrService);
  private http = inject(ProductsHttpService);

  get products$() {
    return this.productsSubject.asObservable().pipe(shareReplay(1));
  }

  get product$() {
    return this.productSubject.asObservable().pipe(shareReplay(1));
  }

  get idValid$() {
    return this.idValidSubject.asObservable().pipe(shareReplay(1));
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

  public create(product: Product): void {
    if (!product) {
      return;
    }

    this.http.create$(product)
    .subscribe({
      next: this.nextCreate,
      error: this.errorCreate,
    });
  }

  private nextCreate = (response: ProductResponse): void => {
    if (!response) {
      this.productSubject.next(null);
      return;
    }

    const product = response.data;
    this.productSubject.next(product);
    this.toastr.success('Producto creado con éxito');
  };

  private errorCreate = (error: HttpErrorResponse): void => {
    console.log(error);
    this.productSubject.next(null);
  };

  public verificationId(id: string): void {
    if (!id) {
      return;
    }

    this.http.verificationId$(id)
    .subscribe({
      next: this.nextVerificatonid,
      error: this.errorVerificationid
    });
  }

  private nextVerificatonid = (valid: boolean): void => {
    this.idValidSubject.next(valid);
  };

  private errorVerificationid = (error: HttpErrorResponse): void => {
    console.log(error);
  };
}
