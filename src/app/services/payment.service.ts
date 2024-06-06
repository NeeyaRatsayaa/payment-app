import { Injectable } from '@angular/core';
import {HttpClient, HttpClientModule, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private getUrl = 'https://uat3ds.2c2p.com/emv3ds/mockservice/masterdata/cardschemes';
  private postUrl = 'https://uat3ds.2c2p.com/emv3ds/mockservice/payment';

  constructor(private http:HttpClient) {
  }
  // Method for GET request
  getCardSchemes(): Observable<any> {
    return this.http.get<any>(this.getUrl);
  }

   // Method for POST request
   makePayment(paymentData: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post<any>(this.postUrl, paymentData, { headers });
  }
}
