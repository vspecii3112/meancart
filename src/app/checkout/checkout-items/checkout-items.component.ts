import { Component, OnInit, Input} from '@angular/core';
import { currency } from '../../objects/currency.class';
import { round } from '../../modules/round.module';

@Component({
  selector: 'app-checkout-items',
  templateUrl: './checkout-items.component.html',
  styleUrls: ['./checkout-items.component.css']
})
export class CheckoutItemsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
    cartItemsArray: number;
  @Input()
    currency: currency;

  coinPrice(price: number, qty: number = 1): string {
    //console.log(this.round(33 * 1.287168 * 2, 2));
    return (round(price * this.currency.rate, 2) * qty).toFixed(2);
  }
}
