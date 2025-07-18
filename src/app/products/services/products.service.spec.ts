import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import { shareReplay, Subject } from 'rxjs';
import { ProductsService } from './products.service';
import { ProductsHttpService } from './products-http.service';
import { Product } from '@products/types/product';
import { ProductResponse, ProductsResponse } from '@products/types/product.response';
import { environment } from 'environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;
  let toastrService: ToastrService;
  let productsHttpService: ProductsHttpService;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Desc 1',
      logo: 'logo1.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Desc 2',
      logo: 'logo2.png',
      date_release: '2023-02-01',
      date_revision: '2024-02-01',
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ToastrModule.forRoot()],
      providers: [ProductsService, ProductsHttpService, ToastrService],
    });

    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
    toastrService = TestBed.inject(ToastrService);
    productsHttpService = TestBed.inject(ProductsHttpService);

    spyOn(toastrService, 'success');
    spyOn(toastrService, 'error');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('list', () => {
    it('should emit products when list is successful', () => {
      const mockResponse: ProductsResponse = { data: mockProducts };

      service.products$.subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      service.list();
      const req = httpMock.expectOne(`${environment.api}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should emit empty array when list fails', () => {
      service.products$.subscribe((products) => {
        expect(products).toEqual([]);
      });

      service.list();
      const req = httpMock.expectOne(`${environment.api}/products`);
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Server Error' });
    });
  });

  describe('verificationId', () => {
    it('should emit true when ID is valid', () => {
      const testId = '123';

      service.idValid$.subscribe((isValid) => {
        expect(isValid).toBeTrue();
      });

      service.verificationId(testId);
      const req = httpMock.expectOne(
        `${environment.api}/products/verification/${testId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(true);
    });

    it('should handle error during ID verification', () => {
      const testId = '123';
      spyOn(console, 'log');

      service.idValid$.subscribe();

      service.verificationId(testId);
      const req = httpMock.expectOne(
        `${environment.api}/products/verification/${testId}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(null, { status: 500, statusText: 'Server Error' });

      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create product successfully and show success message', () => {
      const mockResponse: ProductResponse = { data: mockProducts[0] };

      service.product$.subscribe((product) => {
        expect(product).toEqual(mockProducts[0]);
      });

      service.create(mockProducts[0]);
      const req = httpMock.expectOne(`${environment.api}/products`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);

      expect(toastrService.success).toHaveBeenCalledWith(
        'Producto creado con éxito'
      );
    });

    it('should handle 400 error during creation and show error message', () => {
      service.product$.subscribe((product) => {
        expect(product).toBeNull();
      });

      service.create(mockProducts[0]);
      const req = httpMock.expectOne(`${environment.api}/products`);
      expect(req.request.method).toBe('POST');
      req.flush(null, { status: 400, statusText: 'Bad Request' });

      expect(toastrService.error).toHaveBeenCalledWith(
        'Los datos enviados están incompletos, revisa el formulario'
      );
    });
  });

  describe('observables', () => {
    it('should share and replay products$ observable', () => {
      const mockResponse: ProductsResponse = { data: mockProducts };

      service.products$.subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });

      service.list();
      const req1 = httpMock.expectOne(`${environment.api}/products`);
      req1.flush(mockResponse);

      service.products$.subscribe((products) => {
        expect(products).toEqual(mockProducts);
      });
    });

    it('should share and replay product$ observable', () => {
      const mockResponse: ProductResponse = { data: mockProducts[0] };

      service.product$.subscribe((product) => {
        expect(product).toEqual(mockProducts[0]);
      });

      service.create(mockProducts[0]);
      const req1 = httpMock.expectOne(`${environment.api}/products`);
      req1.flush(mockResponse);

      service.product$.subscribe((product) => {
        expect(product).toEqual(mockProducts[0]);
      });
    });

    it('should share and replay idValid$ observable', () => {
      const testId = '123';

      service.idValid$.subscribe((isValid) => {
        expect(isValid).toBeTrue();
      });

      service.verificationId(testId);
      const req1 = httpMock.expectOne(
         `${environment.api}/products/verification/${testId}`
      );
      req1.flush(true);

      service.idValid$.subscribe((isValid) => {
        expect(isValid).toBeTrue();
      });
    });
  });
});
