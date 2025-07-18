import { Component, input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-errors',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './input-errors.component.html',
  styleUrl: './input-errors.component.scss'
})
export class InputErrorsComponent implements OnInit {
 public inputErrors = input.required<ValidationErrors>();

  ngOnInit(): void {
    console.log(this.inputErrors());
  }
}
