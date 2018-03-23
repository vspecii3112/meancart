import { Component, OnInit } from '@angular/core';
import { ShoppingCartService } from '../services/shopping.cart.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  total_qty: number = 0;    //stores the number of items in the variable and this number is shown beside the shopping cart link
  private total_price: number = 0;  //stores the total price of the shopping cart and this number is shown beside the shopping cart link

  constructor(private shoppingCart: ShoppingCartService) {
  }

  ngOnInit() {
  }

  getTotalQuantity() {
    this.shoppingCart.getTotalQuantity()
      .subscribe(
        data => {
          this.total_qty = data.totalQuantity;
        },
        err => console.log('error getting item quantity'),
        () => console.log('complete getting item quantity')
      )

  }
}
