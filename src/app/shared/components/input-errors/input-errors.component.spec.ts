import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { InputErrorsComponent } from './input-errors.component';

describe('InputErrorsComponent', () => {
  let component: InputErrorsComponent;
  let fixture: ComponentFixture<InputErrorsComponent>;

  const createErrorControlMock = (errors: ValidationErrors | null, touched = true, dirty = true) => {
    return {
      errors: errors,
      touched: touched,
      dirty: dirty,
      invalid: !!errors,
      valid: !errors
    } as AbstractControl;
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, InputErrorsComponent],
      declarations: []
    }).compileComponents();

    fixture = TestBed.createComponent(InputErrorsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('inputErrors', createErrorControlMock(null));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
