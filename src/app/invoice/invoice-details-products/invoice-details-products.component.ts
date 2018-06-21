import { Component, OnInit, Input } from '@angular/core';
import { currency } from '../../objects/currency.class';
import { round } from '../../modules/round.module';

@Component({
  selector: 'app-invoice-details-products',
  templateUrl: './invoice-details-products.component.html',
  styleUrls: ['./invoice-details-products.component.css']
})
export class InvoiceDetailsProductsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  orderedProducts: any;
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
