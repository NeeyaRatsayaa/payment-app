import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CardNumberFormatDirectiveModule } from '../directive/card-number-format.directive';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { PaymentService } from '../services/payment.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-payment-from-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    CardNumberFormatDirectiveModule,
    NgxMaskDirective,
    HttpClientModule,
  ],
  templateUrl: './payment-from-page.component.html',
  styleUrl: './payment-from-page.component.css',
  providers: [provideNgxMask(), PaymentService],
})
export class PaymentFromPageComponent implements OnInit {
  constructor(private paymentService: PaymentService) {}

  //Mock Data DropDownList
  cardTypesList = [
    { id: 1, name: 'visa' },
    { id: 2, name: 'master' },
    { id: 3, name: 'amex' },
    { id: 4, name: 'jcb' },
  ];

  cardNumberLength: any;
  cardNumberFormat = '0000-0000-0000-0000';
  showPaymentResult : boolean = false;
  isLoading: boolean = false;
  resInvoice = '';
  resMessage = '';
  resCode = '';


  form: FormGroup = new FormGroup({
    cardTypes: new FormControl(''),
    cardNumber: new FormControl({ value: '', disabled: true }, [
      Validators.required,
    ]),
    expiry: new FormControl('', [
      Validators.required,
      Validators.pattern('^(0[1-9]|1[0-2])\/?([0-9]{2})$'),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.maxLength(30),
      Validators.pattern('^[a-zA-Z ]*$'),
    ]),
    email: new FormControl('', [Validators.email, Validators.maxLength(50)]),
  });

  ngOnInit(): void {
    this.getCardSchemes();
    this.onChangeCardType();
  }

  getCardSchemes() {
    this.paymentService.getCardSchemes().subscribe(
      (data) => {
        this.cardTypesList = data;
        this.onChangeCardType(); // Ensure this is called after data is loaded
      },
      (error) => console.error(error)
    );
  }


  private onChangeCardType() {
    this.form.get('cardTypes')?.valueChanges.subscribe((cardTypeId) => {
      const selectedCardType = this.cardTypesList.find(
        (type) => type.id == cardTypeId
      );
      this.form.get('cardNumber')?.setValue(null);
      if (selectedCardType?.name !== null) {
        this.form.get('cardNumber')?.enable();
      }
      if (selectedCardType?.name === 'amex') {
        this.cardNumberFormat = '0000-0000-0000-000';
        this.cardNumberLength = 15;
      } else {
        this.cardNumberFormat = '0000-0000-0000-0000';
        this.cardNumberLength = 16;
      }
      this.form
        .get('cardNumber')
        ?.setValidators(Validators.minLength(this.cardNumberLength));
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.isLoading = true;
      this.makePayment();
    }
  }

  private makePayment() {
    const paymentData = {
      cardSchemeId: this.form.value.cardTypes,
      cardNumber: this.form.value.cardNumber,
      expiry: this.form.value.expiry,
      name: this.form.value.name,
      email: this.form.value.email,
    };

    const cardTypeName = this.cardTypesList.find(
      (type) => type.id == paymentData.cardSchemeId
    );

    this.paymentService.makePayment(paymentData).subscribe(
      (response) => {
        this.showPaymentResult = true
        this.isLoading = false;
        if (response.responseCode == '000' || paymentData.cardSchemeId != 4 || cardTypeName?.name != 'jcb' ) { //Ref.JCB id mock data, will change service back
          this.resInvoice = response.Invoice;
          this.resMessage = response.message;
          this.resCode = response.responseCode
        }else{ 
          this.resInvoice = response.Invoice;
          this.resMessage = response.message;
          this.resCode = response.responseCode
        }
      },

      error => {
        this.showPaymentResult = true
        this.isLoading = false;
        this.resInvoice = '';
        this.resMessage = error.message;
        this.resCode = error.responseCode
      } 
    );
  }
}
