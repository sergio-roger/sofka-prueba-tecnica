import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Response } from '@core/types/response';
import { environment } from '../../../environments/environment';
import { Product } from '../types/product';
import { ProductsHttpService } from './products-http.service';

describe('ProductsHttpService', () => {
  let service: ProductsHttpService;
  let httpMock: HttpTestingController;
  const mockProduct = [
    {
      id: 'uno',
      name: 'Product 1',
      description: 'new description some',
      logo: 'logo.jpg',
      date_release: new Date().toString(),
      date_revision: new Date().toString(),
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsHttpService],
    });

    service = TestBed.inject(ProductsHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch the list of products', () => {
    const mockResponse: Response<Product[]> = {
      data: [mockProduct[0]],
    };

    service.list$().subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.api}/products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should check if an ID exists', () => {
    const id = '123';
    const mockResponse = true;

    service.verificationId$(id).subscribe((exists) => {
      expect(exists).toBeTrue();
    });

    const req = httpMock.expectOne(
      `${environment.api}/products/verification/${id}`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should create a product', () => {
    const mockResponse: Response<Product> = {
      data: mockProduct[0],
    };

    service.create$(mockProduct[0]).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.api}/products`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockProduct[0]);
    req.flush(mockResponse);
  });

  it('should update a product', () => {
    const mockResponse: Response<Product> = {
      data: mockProduct[0],
    };

    service.update$(mockProduct[0]).subscribe((response) => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(
      `${environment.api}/products/${mockProduct[0].id}`
    );
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockProduct[0]);
    req.flush(mockResponse);
  });
});
