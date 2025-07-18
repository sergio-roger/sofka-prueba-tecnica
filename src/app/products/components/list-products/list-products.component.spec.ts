import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ListProductsComponent } from './list-products.component';
import { ProductsService } from '@products/services/products.service';
import { TableProductsComponent } from '../table-products/table-products.component';
import { FilterProductsComponent } from '../filter-products/filter-products.component';
import { CommonModule } from '@angular/common';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListProductsComponent', () => {
  let component: ListProductsComponent;
  let fixture: ComponentFixture<ListProductsComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj('ProductsService', ['list'], {
      products$: of([]),
    });

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FilterProductsComponent,
        FormsModule,
        ListProductsComponent,
        RouterTestingModule,
        TableProductsComponent,
      ],
      declarations: [],
      providers: [{ provide: ProductsService, useValue: mockProductsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ListProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty search string', () => {
    expect(component.search).toBe('');
  });

  it('should call list() on ProductsService during ngOnInit', () => {
    component.ngOnInit();
    expect(mockProductsService.list).toHaveBeenCalled();
  });

  it('should render child components', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-filter-products')).toBeTruthy();
    expect(compiled.querySelector('app-table-products')).toBeTruthy();
  });
});
