import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { FilterProductsComponent } from './filter-products.component';

describe('FilterProductsComponent', () => {
  let component: FilterProductsComponent;
  let fixture: ComponentFixture<FilterProductsComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: jasmine.SpyObj<ActivatedRoute>;
  let mockParamMap: ParamMap;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    mockActivatedRoute = jasmine.createSpyObj('ActivatedRoute', [], {
      queryParamMap: of({
        has: (key: string) => key === 'search',
        get: (key: string) => 'test'
      } as unknown as ParamMap)
    });

    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, RouterModule, FilterProductsComponent],
      declarations: [],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FilterProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should subscribe to query parameters', () => {
      spyOn(component, 'queryParamMap').and.callThrough();
      component.ngOnInit();
      expect(component.queryParamMap).toHaveBeenCalled();
    });
  });

  describe('onSearch', () => {
    it('should navigate with search param when value exists', () => {
      component.search.setValue('test-search');
      component.onSearch();

      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        relativeTo: mockActivatedRoute,
        queryParams: { search: 'test-search' },
        queryParamsHandling: 'merge'
      });
    });

    it('should navigate with null search param when value is empty', () => {
      component.search.setValue('   ');
      component.onSearch();

      expect(mockRouter.navigate).toHaveBeenCalledWith([], {
        relativeTo: mockActivatedRoute,
        queryParams: { search: null },
        queryParamsHandling: 'merge'
      });
    });

    it('should trim whitespace from search value', () => {
      component.search.setValue('  test  ');
      component.onSearch();

      expect(mockRouter.navigate).toHaveBeenCalledWith([], jasmine.objectContaining({
        queryParams: { search: 'test' }
      }));
    });
  });

  describe('Form Integration', () => {
    it('should initialize search form control', () => {
      expect(component.search).toBeTruthy();
    });

    it('should update search control value', () => {
      component.search.setValue('new-value');
      expect(component.search.value).toBe('new-value');
    });
  });
});
