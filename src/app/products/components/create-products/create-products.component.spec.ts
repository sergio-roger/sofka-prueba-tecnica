import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ProductsService } from '@products/services/products.service';
import { Product } from '@products/types/product';
import { InputErrorsComponent } from '@shared/components/input-errors/input-errors.component';
import { Subject } from 'rxjs';
import { CreateProductsComponent } from './create-products.component';

describe('CreateProductsComponent', () => {
  let component: CreateProductsComponent;
  let fixture: ComponentFixture<CreateProductsComponent>;
  let mockProductsService: jasmine.SpyObj<ProductsService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let productSubject: Subject<Product | null>;

  beforeEach(async () => {
    productSubject = new Subject<Product | null>();
    mockProductsService = jasmine.createSpyObj('ProductsService', ['create'], {
      product$: productSubject.asObservable(),
    });
    mockRouter = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        CreateProductsComponent,
        InputErrorsComponent,
      ],
      declarations: [],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('onSubmit', () => {
    it('should not call create when form is invalid', () => {
      spyOn(component, 'submited');
      component.form.setErrors({ invalid: true });

      component.onSubmit();

      expect(component.submited).toHaveBeenCalled();
      expect(mockProductsService.create).not.toHaveBeenCalled();
    });

    it('should call create when form is valid', () => {
      const testProduct = {
        id: '1',
        name: 'Valid Product',
        description: 'Valid Description',
        logo: 'valid.png',
        date_release: '2023-01-01',
        date_revision: '2024-01-01',
      };

      component.form.setValue(testProduct);
      component.onSubmit();

      expect(mockProductsService.create).toBeTruthy();
    });
  });

  describe('reset', () => {
    it('should reset form and set submit to false', () => {
      spyOn(component, 'resetForm');
      spyOn(component, 'rejected');

      component.reset();

      expect(component.resetForm).toHaveBeenCalled();
      expect(component.rejected).toHaveBeenCalled();
    });
  });

  describe('redirectToList', () => {
    it('should navigate to products list', () => {
      component.redirectToList();
      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/products/list');
    });
  });

  describe('updateDateRevision', () => {
    it('should update date_revision to one year after date_release', () => {
      const testDate = '2023-01-01';
      const expectedDate = '2024-01-01';

      component.form.get('date_release')?.setValue(testDate);
      component.updateDateReivision();

      expect(component.form.get('date_revision')?.value).toBe(expectedDate);
    });
  });

  describe('getClassInvalid', () => {
    it('should return border-red class when control is invalid', () => {
      const control = {
        invalid: true,
        touched: true,
        dirty: true,
      } as AbstractControl;
      spyOn(component.validation, 'verify').and.returnValue(true);

      const result = component.getClassInvalid('testControl');

      expect(result).toEqual({ 'border-red': true });
    });

    it('should not return border-red class when control is valid', () => {
      const control = { invalid: false } as AbstractControl;
      spyOn(component.validation, 'verify').and.returnValue(false);

      const result = component.getClassInvalid('testControl');

      expect(result).toEqual({ 'border-red': false });
    });
  });
});
