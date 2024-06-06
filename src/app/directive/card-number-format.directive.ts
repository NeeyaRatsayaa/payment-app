import { Directive, ElementRef, HostListener, NgModule } from '@angular/core';

@Directive({
  selector: '[appCardNumberFormat]'
})
export class CardNumberFormatDirective {

  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent): void {
    const input = this.el.nativeElement;
    let value = input.value.replace(/\D/g, '');
    const sections = value.match(/.{1,4}/g);
    if (sections) {
      input.value = sections.join('-');
    }
  }
}

@NgModule({
    declarations: [CardNumberFormatDirective],
    exports: [CardNumberFormatDirective],
  })
  export class CardNumberFormatDirectiveModule {}
