import { Component, OnInit, Input} from '@angular/core';
import { currency } from '../../objects/currency.class';

@Component({
  selector: 'app-checkout-orderdetails',
  templateUrl: './checkout-orderdetails.component.html',
  styleUrls: ['./checkout-orderdetails.component.css']
})
export class CheckoutOrderdetailsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
    _cartTotalPrice: number;
  @Input()
    currency: currency;

  coinPriceDisplay(price: number): string {
    return price.toFixed(2);
  }
}
