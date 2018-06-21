import { Component, OnInit, Input } from '@angular/core';
import { currency } from '../../objects/currency.class';
import { round } from '../../modules/round.module';

@Component({
  selector: 'app-invoice-details-total',
  templateUrl: './invoice-details-total.component.html',
  styleUrls: ['./invoice-details-total.component.css']
})
export class InvoiceDetailsTotalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  orderSubTotal: number;
  @Input()
  currency: currency;

  coinPriceDisplay(price: number): string {
    return price.toFixed(2);
  }

  //this function is used so that the html template can access the round function module 
  roundPrice(num: number, precision: number): number {
    return round(num, precision);
  }
}
