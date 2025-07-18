import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { of } from 'rxjs';
import { TableProductsComponent } from './table-products.component';

describe('TableProductsComponent', () => {
  let component: TableProductsComponent;
  let fixture: ComponentFixture<TableProductsComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockChangeDetectorRef: jasmine.SpyObj<ChangeDetectorRef>;

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2023-01-01',
      date_revision: '2024-01-01',
      action: false
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: '2023-02-01',
      date_revision: '2024-02-01',
      action: false
    },
    {
      id: '3',
      name: 'Another Product',
      description: 'Another Description',
      logo: 'logo3.png',
      date_release: '2023-03-01',
      date_revision: '2024-03-01',
      action: false
    }
  ];

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', [], {
      products$: of(mockProducts)
    });

    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParamMap: of({
        has: (key: string) => key === 'search',
        get: (key: string) => 'product'
      } as unknown as ParamMap)
    });

    mockChangeDetectorRef = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, ReactiveFormsModule, TableProductsComponent],
      declarations: [],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ChangeDetectorRef, useValue: mockChangeDetectorRef }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TableProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should initialize with products and set action to false', () => {
      component.ngOnInit();
      expect(component.products.length).toBe(3);
      expect(component.products.every(p => p.action === false)).toBeTrue();
      expect(component.filteredProducts.length).toBeGreaterThan(0);
    });

    it('should subscribe to query parameters', () => {
      spyOn(component, 'queryParamMap').and.callThrough();
      component.ngOnInit();
      expect(component.queryParamMap).toHaveBeenCalled();
    });
  });

  describe('getProducts', () => {
    it('should not process empty products array', () => {
      component.getProducts([]);
      expect(component.products.length).toBe(3);
      expect(component.filteredProducts.length).toBe(3);
    });

    it('should process products and initialize filteredProducts', () => {
      component.getProducts(mockProducts);
      expect(component.products.length).toBe(3);
      expect(component.filteredProducts.length).toBe(3);
      expect(component.products[0].action).toBeFalse();
    });
  });

  describe('queryParamMap', () => {
    it('should call searchProduct when search param exists', () => {
      spyOn(component, 'searchProduct');
      const paramMap = { has: () => true, get: () => 'test' } as unknown as ParamMap;
      component.queryParamMap(paramMap);
      expect(component.searchProduct).toHaveBeenCalledWith('test');
    });
  });

  describe('searchProduct', () => {
    it('should filter products by name', () => {
      component.products = mockProducts;
      component.searchProduct('Product 1');
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].name).toBe('Product 1');
    });

    it('should filter products by description', () => {
      component.products = mockProducts;
      component.searchProduct('Description 2');
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].description).toBe('Description 2');
    });

    it('should filter products by date', () => {
      component.products = mockProducts;
      component.searchProduct('2023-03');
      expect(component.filteredProducts.length).toBe(1);
      expect(component.filteredProducts[0].date_release).toBe('2023-03-01');
    });

    it('should return all products when search is empty', () => {
      component.products = mockProducts;
      component.searchProduct('');
      expect(component.filteredProducts.length).toBe(3);
    });
  });

  describe('paginate', () => {
    beforeEach(() => {
      component.products = mockProducts;
      component.selectedPageSize = 2;
    });

    it('should paginate products correctly', () => {
      component.paginate(component.products);
      expect(component.filteredProducts.length).toBe(2);
    });

    it('should handle page limits correctly', () => {
      component.selectedPageSize = 5;
      component.paginate(component.products);
      expect(component.filteredProducts.length).toBe(3);
    });
  });

  describe('onPageSizeChange', () => {
    it('should update page size and reset to first page', () => {
      spyOn(component, 'paginate');
      component.size.setValue('5');
      component.onPageSizeChange();
      expect(component.selectedPageSize).toBe(5);
      expect(component.currentPage).toBe(1);
      expect(component.paginate).toHaveBeenCalledWith(component.products);
    });
  });

  describe('onPageChange', () => {
    it('should change current page and paginate', () => {
      spyOn(component, 'paginate');
      component.onPageChange(2);
      expect(component.currentPage).toBe(2);
      expect(component.paginate).toHaveBeenCalledWith(component.products);
    });
  });
});
