import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[expiryFormat]'
})
export class ExpiryFormatDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent): void {
  }
}
