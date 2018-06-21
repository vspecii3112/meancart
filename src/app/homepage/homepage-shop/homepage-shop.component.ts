import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { coin } from '../../objects/coin.class';
import { currency } from '../../objects/currency.class';
import { round } from '../../modules/round.module';

@Component({
  selector: 'app-homepage-shop',
  templateUrl: './homepage-shop.component.html',
  styleUrls: ['./homepage-shop.component.css']
})
export class HomepageShopComponent implements OnInit {

  constructor() { }

  ngOnInit() {

  }

  @Input()
    coinsArray: coin;

  @Input()
    currency: currency;   //the rate for currency conversion

  @Output()
    addItemEmitter: EventEmitter<any> = new EventEmitter<any>();

  //For display purposes this function will round and add 2 decimal places to a number
  coinPrice(price: number): string {
    return (round(price * this.currency.rate, 2)).toFixed(2);
  }

  addItemToCart(coinID, itemQty) {
    //emit the change back to the parent component
    this.addItemEmitter.emit({coinID, itemQty});  //since emit parameter only takes 1 parameter, we must pass parameter back as object
  }
}