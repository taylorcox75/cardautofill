
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-credit-card-input',
  templateUrl: './credit-card-input.component.html',
  styleUrls: ['./credit-card-input.component.css']
})
export class CreditCardInputComponent {
  creditCardForm: FormGroup;
  showCardNumber = false;
  months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  years = Array.from({ length: 20 }, (_, i) => (new Date().getFullYear() + i).toString());
  states = ['State1', 'State2', 'State3', '...']; // Add actual states here

  constructor(private fb: FormBuilder) {
    this.creditCardForm = this.fb.group({
      cardNumber: ['', [Validators.required, this.luhnValidator]],
      month: ['', Validators.required],
      year: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      address1: ['', Validators.required],
      address2: [''],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required]
    });
  }

  toggleShowCardNumber() {
    this.showCardNumber = !this.showCardNumber;
  }

  formatCardNumber() {
    const value = this.creditCardForm.get('cardNumber')?.value.replace(/\D/g, '');
    const formattedValue = value.replace(/(.{4})/g, '$1 ').trim();
    this.creditCardForm.get('cardNumber')?.setValue(formattedValue, { emitEvent: false });
  }

  luhnValidator(control: any) {
    const value = control.value.replace(/\D/g, '');
    let sum = 0;
    for (let i = 0; i < value.length; i++) {
      let intVal = parseInt(value.substr(i, 1));
      if (i % 2 === 0) {
        intVal *= 2;
        if (intVal > 9) {
          intVal = 1 + (intVal % 10);
        }
      }
      sum += intVal;
    }
    return (sum % 10 === 0) ? null : { luhn: true };
  }

  onSubmit() {
    if (this.creditCardForm.valid) {
      console.log(this.creditCardForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
