import { Observable } from 'rxjs';
import { Response } from '../../core/types/response';
import { Product } from './product';

export type ProductsResponse = Response<Product[]>;

export type ProductsResponseObservable = Observable<ProductsResponse>;

export type ProductResponse = Response<Product>;

export type ProductResponseObservable = Observable<ProductResponse>;
