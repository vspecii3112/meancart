import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { coin } from '../../objects/coin.class';

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

  @Output()
    addItemEmitter: EventEmitter<any> = new EventEmitter<any>();

  addItemToCart(coinID, itemQty) {
    //emit the change back to the parent component
    this.addItemEmitter.emit({coinID, itemQty});  //since emit parameter only takes 1 parameter, we must pass parameter back as object
  }
}
