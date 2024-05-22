import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInput } from '@angular/material/input';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  cardForm: FormGroup;
  cardType = '';
  cvvMaxLength: number = 3; // Default CVV length
  cardNumber: string = '';
  cvv: string = '';
  expMonth: string = '';
  expYear: string = '';
  showCardDetails: boolean = false;
  showCVVDetails: boolean = false;
  @ViewChild('cvvInput') cvvInput: MatInput;
  @ViewChild('creditInput') creditInput: MatInput;

  constructor(private fb: FormBuilder) {
    this.cardForm = this.fb.group({
      cardNumber: ['', [Validators.required, this.luhnValidator]],
      cvv: ['', [Validators.required, this.cvvValidator.bind(this)]],
      expirationDate: ['', [Validators.required, this.expirationDateValidator]],
      expMonth: ['', Validators.required],
      expYear: ['', Validators.required]
    });
  }

  onCardNumberChange(value: string) {
    this.detectCardType(value);
    // Update CVV max length based on card type
    let cardNumber = this.cardForm.get('cardNumber')?.value.replace(/\D/g, '');
    if (this.showCardDetails) {
      cardNumber = cardNumber.match(/.{1,4}/g)?.join(' ');
    }
    else {
      cardNumber = this.cardForm.get('cardNumber')?.value.replace(/\D/g, '');

    }
    this.cardForm.get('cardNumber')?.setValue(cardNumber);
    this.cvvMaxLength = this.cardType === 'American Express' ? 4 : 3;
    this.cardForm.get('cvv')?.updateValueAndValidity(); // Force re-validation of CVV
  }
  getCardMaxLength() {
    if (!this.showCardDetails) {
      return this.cardType === 'American Express' ? 15 : 16;
    } else {
      return (this.cardType === 'American Express' ? 15 : 16) + 3;
    }
  }
  toggleCardDetails() {
    let cardNumber = this.cardForm.get('cardNumber')?.value.replace(/\D/g, '');

    if (!this.showCardDetails) {
      cardNumber = cardNumber.match(/.{1,4}/g)?.join(' ');
    }
    else {
      cardNumber = this.cardForm.get('cardNumber')?.value.replace(/\D/g, '');


    }
    this.cardForm.get('cardNumber')?.setValue(cardNumber);

    this.showCardDetails = !this.showCardDetails;
    if (this.showCardDetails) {
      setTimeout(() => {
        this.creditInput.focus();
      }, 0);
    }
  }
  toggleCVVDetails() {
    this.showCVVDetails = !this.showCVVDetails;
    if (this.showCVVDetails) {
      setTimeout(() => {
        this.cvvInput.focus();
      }, 0);
    }
  }
  detectCardType(value: string) {
    if (value.startsWith('4')) {
      this.cardType = 'Visa';
    } else if (/^5[1-5]/.test(value)) {
      this.cardType = 'MasterCard';
    } else if (/^3[47]/.test(value)) {
      this.cardType = 'American Express';
    } else if (/^6(?:011|5)/.test(value)) {
      this.cardType = 'Discover';
    } else {
      this.cardType = 'Unknown';
    }
  }

  cvvValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const validLength = this.cardType === 'American Express' ? 4 : 3;
    return control.value.length === validLength ? null : { invalidCvv: true };
  }
  getYears() {
    const currentYear = new Date().getFullYear();
    return Array.from({length: 20}, (_, i) => currentYear + i);
  }
  expirationDateValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }
    const [month, year] = control.value.split('/');
    const currentYear = new Date().getFullYear() % 100; // Get last two digits of the year
    const currentMonth = new Date().getMonth() + 1;

    if (year < currentYear || (year == currentYear && month < currentMonth) || month < 1 || month > 12) {
      return { invalidExpirationDate: true };
    }

    return null;
  }

  luhnValidator(control: any): { [key: string]: any } | null {
    if (!control.value) {
      return null;
    }

    let nCheck = 0, bEven = false;
    const value = control.value.replace(/\D/g, "");

    for (let n = value.length - 1; n >= 0; n--) {
      let nDigit = parseInt(value.charAt(n), 10);
      if (bEven) {
        nDigit *= 2;
        if (nDigit > 9) nDigit -= 9;
      }
      nCheck += nDigit;
      bEven = !bEven;
    }

    return (nCheck % 10) == 0 ? null : { invalidLuhn: true };
  }
}
