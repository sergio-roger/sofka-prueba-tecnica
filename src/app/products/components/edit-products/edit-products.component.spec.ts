import { CommonModule, Location } from '@angular/common';
import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { InputErrorsComponent } from '@shared/components/input-errors/input-errors.component';
import { of } from 'rxjs';
import { EditProductsComponent } from './edit-products.component';

describe('EditProductsComponent', () => {
  let component: EditProductsComponent;
  let fixture: ComponentFixture<EditProductsComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockLocation: jasmine.SpyObj<Location>;
  let mockActivatedRoute: { params: {} };

  const mockProduct: Product = {
    id: 'test1',
    name: 'Test Product',
    description: 'Test Description',
    logo: 'test.png',
    date_release: new Date('2023-01-01'),
    date_revision: new Date('2024-01-01'),
  };

  beforeEach(async () => {
    mockProductsService = jasmine.createSpyObj(
      'ProductsService',
      ['list', 'update'],
      {
        products$: of([mockProduct]),
        product$: of(mockProduct),
      }
    );

    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
    mockLocation = jasmine.createSpyObj('Location', ['back']);

    mockActivatedRoute = {
      params: of({ id: 'test1' }),
    };

    await TestBed.configureTestingModule({
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        EditProductsComponent,
        InputErrorsComponent,
      ],
      declarations: [],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter },
        { provide: Location, useValue: mockLocation },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with id control disabled', () => {
    expect(component.id.disabled).toBeTrue();
  });

  it('should load product data on init', fakeAsync(() => {
    component.ngOnInit();
    tick();

    expect(mockProductsService.list).toHaveBeenCalled();
    expect(component.product).toEqual(mockProduct);
    expect(component.id.value).toBe(mockProduct.id);
    expect(component.name.value).toBe(mockProduct.name);
  }));

  it('should redirect to list if no id param', fakeAsync(() => {
    mockActivatedRoute.params = of({});
    component.ngOnInit();
    tick();

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/products/list');
  }));

  it('should not fill form if no product', () => {
    const initialValue = component.form.value;
    component.product = null;
    component.fillForm();

    expect(component.form.value).toEqual(initialValue);
  });

  it('should not update product on invalid form submission', () => {
    component.form.setErrors({ invalid: true });
    component.onSubmit();

    expect(mockProductsService.update).not.toHaveBeenCalled();
  });

  it('should update revision date when release date changes', () => {
    const newDate = '2023-06-01';
    const expectedRevision = '2024-06-01';

    spyOn(component.dateFnsCustom, 'parseDate').and.returnValue(
      new Date(newDate)
    );
    spyOn(component.dateFnsCustom, 'addYears').and.returnValue(
      expectedRevision
    );

    component.date_release.setValue(newDate);
    component.updateDateReivision();

    expect(component.date_revision.value).toBe(expectedRevision);
  });

  it('should navigate back when back() is called', () => {
    component.back();
    expect(mockLocation.back).toHaveBeenCalled();
  });

  it('should redirect to list when redirectToList() is called', () => {
    component.redirectToList();
    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/products/list');
  });

  it('should get invalid class for invalid controls', () => {
    component.name.setErrors({ required: true });
    component.name.markAsTouched();

    const invalidClass = component.getClassInvalid('name');
    expect(invalidClass['border-red']).toBeTrue();
  });
});
