import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[creditCardMask]'
})
export class CreditCardMaskDirective {
  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onInputChange(event: any) {
    const initialValue = this.el.nativeElement.value;

    // Remove all non-digit characters
    let v = initialValue.replace(/\D/g, '');

    // Split into groups of 4 and join with spaces
    let matches = v.match(/(\d{1,4})/g);
    let value = matches ? matches.join(' ') : '';

    // Update the input value
    this.el.nativeElement.value = value;
  }
}