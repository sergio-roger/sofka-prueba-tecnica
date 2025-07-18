import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-input-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-errors.component.html',
  styleUrl: './input-errors.component.scss'
})
export class InputErrorsComponent {
 public inputErrors = input.required<ValidationErrors>();
}
